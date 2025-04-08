import { NextRequest, NextResponse } from "next/server";
import { generateModernTemplate } from "@/templates/modern/template";
import { generateRocketTemplate } from "@/templates/rocket/template";
import { generateCosmicTemplate } from "@/templates/cosmic/template";
import { generateMinimalTemplate } from "@/templates/minimal/template";
import { generatePepeTemplate } from "@/templates/pepe/template";
import { generatePlayfulTemplate } from "@/templates/playful/template";
import { generateStellarTemplate } from "@/templates/stellar/template";
import { GenerateRequestBody, GeneratedTemplate, PreviewData } from "@/types";
import { UserWebsiteMetadata, WebsiteGeneration } from "@/types/website-generation";
import JSZip from 'jszip';
import { withAuth, AuthenticatedRequest } from "@/lib/api-middleware";
import { getSubscriptionStatus } from "@/lib/auth-utils";
import { supabase } from "@/lib/supabase";
import { createClient } from '@supabase/supabase-js';

// Create a Supabase admin client with service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  return withAuth(request, handleGenerateRequest);
}

async function handleGenerateRequest(request: AuthenticatedRequest) {
  try {
    // Parse request body
    const body = await request.json();
    console.log('Received request body:', body);
    console.log('Coin name:', body.coinName);

    // Extract template ID
    const { templateId } = body;

    if (!templateId) {
      console.error('Missing template ID');
      return NextResponse.json(
        { error: "Missing template ID" },
        { status: 400 }
      );
    }

    // Map old template IDs to new ones for backward compatibility
    const mappedTemplateId = templateId === 'modern' ? 'modern-doge-v2' :
                            templateId === 'rocket' ? 'moon-rocket-v2' :
                            templateId === 'cosmic' ? 'cosmic-space-v1' :
                            templateId === 'pepe' ? 'pepe-space-v1' :
                            templateId === 'minimal' ? 'minimal-space-v1' :
                            templateId === 'playful' ? 'playful-character-v1' :
                            templateId === 'stellar' ? 'test-space-v1' :
                            templateId;

    // Check subscription status
    const userId = request.userId;
    const { isSubscribed } = await getSubscriptionStatus(userId);
    
    // If not subscribed, check if they've reached the free limit
    if (!isSubscribed) {
      const { data: userData } = await supabaseAdmin
        .from('user_public_metadata')
        .select('total_generated')
        .eq('user_id', userId)
        .single();
      
      console.log('User data for free limit check:', userData);
      
      if (userData && userData.total_generated >= 3) {
        return NextResponse.json(
          { error: 'Free generation limit reached' },
          { status: 403 }
        );
      }
    }

    // Create preview data
    const previewData: PreviewData = {
      templateId: mappedTemplateId,
      sections: {
        hero: body.sections?.hero ?? true,
        tokenomics: body.sections?.tokenomics ?? true,
        roadmap: body.sections?.roadmap ?? true,
        team: body.sections?.team ?? true,
        faq: body.sections?.faq ?? true,
        community: body.sections?.community ?? true
      },
      coinName: body.coinName,
      tokenSymbol: body.tokenSymbol,
      description: body.description,
      primaryColor: body.primaryColor,
      secondaryColor: body.secondaryColor,
      logoUrl: body.logoUrl,
      contractAddress: body.contractAddress,
      buyLink: body.buyLink,
      socialLinks: body.socialLinks,
      tokenomics: body.tokenomics,
      roadmap: body.roadmap,
      team: body.team,
      faq: body.faq,
      seo: {
        title: body.seo?.title || `${body.coinName} (${body.tokenSymbol}) - The Next Generation Memecoin`,
        description: body.seo?.description || `Join the ${body.coinName} revolution! The most exciting memecoin in the crypto space.`,
        keywords: body.seo?.keywords || `${body.coinName}, ${body.tokenSymbol}, memecoin, cryptocurrency, token, blockchain, defi`,
        ogImage: body.seo?.ogImage || body.logoUrl
      }
    };

    console.log('Using template ID:', mappedTemplateId);
    console.log('Preview Data:', previewData);

    let generatedFiles: GeneratedTemplate;

    switch (mappedTemplateId) {
      case 'modern-doge-v2':
        generatedFiles = generateModernTemplate(previewData);
        break;
      case 'moon-rocket-v2':
        generatedFiles = generateRocketTemplate(previewData);
        break;
      case 'cosmic-space-v1':
        generatedFiles = generateCosmicTemplate(previewData);
        break;
      case 'minimal-space-v1':
        generatedFiles = generateMinimalTemplate(previewData);
        break;
      case 'pepe-space-v1':
        generatedFiles = generatePepeTemplate(previewData);
        break;
      case 'playful-character-v1':
        generatedFiles = generatePlayfulTemplate(previewData);
        break;
      case 'test-space-v1':
        generatedFiles = generateStellarTemplate(previewData);
        break;
      default:
        console.error('Invalid template ID:', mappedTemplateId);
        return NextResponse.json(
          { error: "Invalid template ID" },
          { status: 400 }
        );
    }

    // Create a new JSZip instance
    const zip = new JSZip();

    // Add files to the zip
    zip.file('index.html', generatedFiles.html);
    zip.file('styles.css', generatedFiles.css);
    zip.file('main.js', generatedFiles.js);

    try {
      // Generate the zip file
      const zipContent = await zip.generateAsync({ 
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6
        }
      });

      // Convert Blob to Buffer
      const buffer = Buffer.from(await zipContent.arrayBuffer());

      // Return the zip file
      const filename = body.coinName ? `${body.coinName.toLowerCase()}-website.zip` : 'memecoin-website.zip';
      console.log('Generated filename:', filename); // Debug log
      
      // Get current user metadata
      console.log('Getting current user metadata for:', userId);
      const { data: userData, error: fetchError } = await supabaseAdmin
        .from('user_public_metadata')
        .select('total_generated, websites, total_spent, payments')
        .eq('user_id', userId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching user metadata:', fetchError);
        
        // Check if this is a "no rows returned" error, which means we need to create the metadata
        if (fetchError.code === 'PGRST116') {
          console.log('No user metadata found, creating new record for user:', userId);
          
          // Create new user metadata record with website details
          const websiteDetails = {
            coinName: body.coinName,
            tokenSymbol: body.tokenSymbol,
            contractAddress: body.contractAddress || '0xD0ntL34v3Th1sPl4c3h0ld3rHere',
            timestamp: new Date().toISOString()
          };
          
          // Check if payment information is available
          const paymentAmount = body.paymentAmount || 0;
          const paymentTx = body.paymentTx || null;
          
          // Create payment record if payment was made
          const paymentRecord = paymentTx ? {
            amount: paymentAmount,
            tx_hash: paymentTx,
            explorer_url: body.explorerUrl || null,
            timestamp: new Date().toISOString()
          } : null;
          
          const { data: newMetadata, error: createError } = await supabaseAdmin
            .from('user_public_metadata')
            .insert({
              user_id: userId,
              total_generated: 1,
              total_spent: paymentAmount,
              websites: [websiteDetails],
              payments: paymentRecord ? [paymentRecord] : []
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating user metadata:', createError);
          } else {
            console.log('User metadata created successfully:', newMetadata);
          }
        }
      } else {
        // Update total generated count and add website details
        const currentCount = userData?.total_generated || 0;
        const newCount = currentCount + 1;
        
        // Get existing websites array
        const existingWebsites = userData?.websites || [];
        
        // Create new website details
        const websiteDetails = {
          coinName: body.coinName,
          tokenSymbol: body.tokenSymbol,
          contractAddress: body.contractAddress || '0xD0ntL34v3Th1sPl4c3h0ld3rHere',
          timestamp: new Date().toISOString()
        };
        
        // Check if payment information is available
        const paymentAmount = body.paymentAmount || 0;
        const paymentTx = body.paymentTx || null;
        const currentTotalSpent = userData?.total_spent || 0;
        const newTotalSpent = currentTotalSpent + paymentAmount;
        
        // Create payment record if payment was made
        const paymentRecord = paymentTx ? {
          amount: paymentAmount,
          tx_hash: paymentTx,
          explorer_url: body.explorerUrl || null,
          timestamp: new Date().toISOString()
        } : null;
        
        // Get existing payments array
        const existingPayments = userData?.payments || [];
        const updatedPayments = paymentRecord ? [...existingPayments, paymentRecord] : existingPayments;
        
        const { error: updateError } = await supabaseAdmin
          .from('user_public_metadata')
          .update({ 
            total_generated: newCount,
            total_spent: newTotalSpent,
            websites: [...existingWebsites, websiteDetails],
            payments: updatedPayments
          })
          .eq('user_id', userId);
          
        if (updateError) {
          console.error('Error updating user metadata:', updateError);
        } else {
          console.log('User metadata updated successfully');
        }
      }

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${filename}"`,
        }
      });
    } catch (error) {
      console.error('Error generating zip file:', error);
      return NextResponse.json(
        { error: "Failed to generate zip file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
