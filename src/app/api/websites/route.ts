import { NextRequest, NextResponse } from 'next/server';
import { WebsiteGeneration } from '@/types/website-generation';
import { withAuth, AuthenticatedRequest } from '@/lib/api-middleware';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase admin client with service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(req: NextRequest) {
  return withAuth(req, handleGetWebsites);
}

async function handleGetWebsites(req: AuthenticatedRequest) {
  const userId = req.userId;

  try {
    // Check if supabase client is available
    if (!supabase) {
      console.error('Database connection not available');
      return NextResponse.json({
        success: false,
        error: 'Database connection not available'
      }, { status: 500 });
    }
    
    // Get websites data from user_public_metadata table
    const { data, error } = await supabase!
      .from('user_public_metadata')
      .select('websites, total_generated, total_spent, payments')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching website history:', error);
      
      // Check if this is a 'no rows returned' error, which means the user doesn't have metadata yet
      if (error.code === 'PGRST116') {
        console.log('No metadata found for user, creating default metadata');
        
        // Create default metadata for the user
        const { error: createError } = await supabaseAdmin
          .from('user_public_metadata')
          .insert({
            user_id: userId,
            websites: [],
            total_generated: 0,
            total_spent: 0,
            payments: []
          });
          
        if (createError) {
          console.error('Error creating default metadata:', createError);
          return NextResponse.json(
            { error: 'Error creating user metadata' },
            { status: 500 }
          );
        }
        
        // Return default empty data
        return NextResponse.json({
          websites: [],
          totalGenerated: 0,
          totalSpent: 0,
          payments: []
        });
      }
      
      return NextResponse.json(
        { error: 'Error fetching website history' },
        { status: 500 }
      );
    }
    
    const websites = data?.websites || [];
    
    return NextResponse.json({
      websites,
      totalGenerated: data?.total_generated || 0,
      totalSpent: data?.total_spent || 0,
      payments: data?.payments || []
    });
  } catch (error) {
    console.error('Error fetching website history:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return withAuth(req, handleCreateWebsite);
}

async function handleCreateWebsite(req: AuthenticatedRequest) {
  const userId = req.userId;

  try {
    // Parse the request body once
    const requestBody = await req.json();
    const { hash, price, isPremium, coinName, tokenSymbol, contractAddress, explorerUrl } = requestBody;
    
    // Get current user metadata using admin client to bypass RLS
    const { data: userData, error: userError } = await supabaseAdmin
      .from('user_public_metadata')
      .select('websites, total_generated, total_spent, payments')
      .eq('user_id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user metadata:', userError);
      return NextResponse.json(
        { error: 'Error fetching user data' },
        { status: 500 }
      );
    }
    
    // Get existing data or initialize
    const existingWebsites = userData?.websites || [];
    const existingTotalSpent = userData?.total_spent || 0;
    const existingTotalGenerated = userData?.total_generated || 0;
    const existingPayments = userData?.payments || [];

    // Create new website generation record with more details
    const websiteGeneration: WebsiteGeneration = {
      ...(hash ? { transactionHash: hash } : {}),  // Only include transactionHash if provided
      ...(price ? { price } : {}),  // Only include price if provided
      ...(coinName ? { coinName } : {}),  // Include coin name if provided
      ...(tokenSymbol ? { tokenSymbol } : {}),  // Include token symbol if provided
      ...(contractAddress ? { contractAddress } : {}),  // Include contract address if provided
      ...(explorerUrl ? { explorerUrl } : {}),  // Include explorer URL if provided
      timestamp: new Date().toISOString()
    };

    // Calculate new values
    const newTotalGenerated = existingTotalGenerated + 1;
    const newTotalSpent = price ? existingTotalSpent + price : existingTotalSpent;
    
    // Create payment record if payment was made
    let newPayments = existingPayments;
    if (hash && price) {
      const paymentRecord = {
        transaction_hash: hash,
        amount: price,
        timestamp: new Date().toISOString(),
        explorer_url: explorerUrl
      };
      newPayments = [...existingPayments, paymentRecord];
    }
    
    // Update user metadata in Supabase using admin client to bypass RLS
    const { data: updatedData, error: updateError } = await supabaseAdmin
      .from('user_public_metadata')
      .update({
        websites: [...existingWebsites, websiteGeneration],
        total_generated: newTotalGenerated,
        total_spent: newTotalSpent,
        payments: newPayments
      })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating website data:', updateError);
      return NextResponse.json(
        { error: 'Error recording website generation' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      metadata: updatedData
    });
  } catch (error) {
    console.error('Error recording website generation:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
