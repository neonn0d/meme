import { NextRequest, NextResponse } from "next/server";
import { generateModernTemplate } from "@/templates/modern/template";
import { generateRocketTemplate } from "@/templates/rocket/template";
import { generateCosmicTemplate } from "@/templates/cosmic/template";
import { generateMinimalTemplate } from "@/templates/minimal/template";
import { generatePepeTemplate } from "@/templates/pepe/template";
import { generateChristmasTemplate } from "@/templates/christmas/template";
import { GenerateRequestBody, GeneratedTemplate, PreviewData } from "@/types";
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
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
                            templateId === 'christmas' ? 'christmas-space-v1' :
                            templateId === 'minimal' ? 'minimal-space-v1' :
                            templateId;

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
      case 'christmas-space-v1':
        generatedFiles = generateChristmasTemplate(previewData);
        break;
      case 'pepe-space-v1':
        generatedFiles = generatePepeTemplate(previewData);
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
