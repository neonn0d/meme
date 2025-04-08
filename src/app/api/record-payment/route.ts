import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isValidWalletAddress } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, amount, paymentType, transactionHash, plan } = body;
    
    if (!walletAddress || !amount || !paymentType || !transactionHash) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    console.log('Recording payment for wallet:', walletAddress);
    
    // Validate wallet address format
    if (!isValidWalletAddress(walletAddress)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid wallet address format' 
      }, { status: 400 });
    }
    
    // Check if supabase client is available
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection not available' 
      }, { status: 500 });
    }
    
    // Step 1: Find the user by wallet address
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress);
    
    if (userError) {
      console.error('Error finding user:', userError);
      return NextResponse.json({ 
        success: false, 
        error: `Error finding user: ${userError.message}` 
      }, { status: 500 });
    }
    
    if (!users || users.length === 0) {
      console.error('No user found with wallet address:', walletAddress);
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    const user = users[0];
    console.log('Found user:', user.id);
    
    // Step 2: Create payment record in the payments table
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        amount: amount,
        currency: 'SOL',
        status: 'completed',
        transaction_hash: transactionHash,
        payment_type: paymentType,
        metadata: plan ? { plan } : {}
      })
      .select()
      .single();
      
    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      return NextResponse.json({ 
        success: false, 
        error: `Error creating payment record: ${paymentError.message}` 
      }, { status: 500 });
    }
    
    // Step 3: Check if metadata exists and update it
    const { data: metadata, error: metadataError } = await supabase
      .from('user_public_metadata')
      .select('*')
      .eq('user_id', user.id);
    
    if (metadataError) {
      console.error('Error checking metadata:', metadataError);
      return NextResponse.json({ 
        success: false, 
        error: `Error checking metadata: ${metadataError.message}` 
      }, { status: 500 });
    }
    
    // Step 4: Create or update metadata
    if (!metadata || metadata.length === 0) {
      // Create new metadata record
      console.log('Creating new metadata record');
      
      // Set initial values based on payment type
      const initialWebsites = paymentType === 'website' ? 1 : 0;
      
      const { error: insertError } = await supabase
        .from('user_public_metadata')
        .insert({
          user_id: user.id,
          total_spent: amount,
          websites: [],
          total_generated: initialWebsites
        });
      
      if (insertError) {
        console.error('Error creating metadata:', insertError);
        return NextResponse.json({ 
          success: false, 
          error: `Error creating metadata: ${insertError.message}` 
        }, { status: 500 });
      }
    } else {
      // Update existing metadata
      const existingMetadata = metadata[0];
      
      console.log('Updating existing metadata');
      
      // Increment website count if this is a website payment
      const websiteIncrement = paymentType === 'website' ? 1 : 0;
      const newTotalGenerated = (existingMetadata.total_generated || 0) + websiteIncrement;
      
      console.log(`Payment type: ${paymentType}, incrementing websites by ${websiteIncrement}`);
      console.log(`Current total_generated: ${existingMetadata.total_generated}, new total: ${newTotalGenerated}`);
      
      const { error: updateError } = await supabase
        .from('user_public_metadata')
        .update({
          total_spent: (existingMetadata.total_spent || 0) + amount,
          total_generated: newTotalGenerated
        })
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('Error updating metadata:', updateError);
        return NextResponse.json({ 
          success: false, 
          error: `Error updating metadata: ${updateError.message}` 
        }, { status: 500 });
      }
    }
    
    // Step 5: If this is a subscription payment, create or update subscription
    if (paymentType === 'subscription' && plan) {
      const subscriptionPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
      const currentDate = new Date();
      const periodEnd = new Date(currentDate.getTime() + subscriptionPeriod);
      
      // Check for existing subscription
      const { data: existingSubscription, error: subCheckError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      
      if (subCheckError) {
        console.error('Error checking subscription:', subCheckError);
      }
      
      if (existingSubscription) {
        // Update existing subscription
        const { error: updateSubError } = await supabase
          .from('subscriptions')
          .update({
            current_period_end: periodEnd.toISOString(),
            price_id: plan
          })
          .eq('id', existingSubscription.id);
          
        if (updateSubError) {
          console.error('Error updating subscription:', updateSubError);
        }
      } else {
        // Create new subscription
        const { error: createSubError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            status: 'active',
            price_id: plan,
            current_period_start: currentDate.toISOString(),
            current_period_end: periodEnd.toISOString()
          });
          
        if (createSubError) {
          console.error('Error creating subscription:', createSubError);
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Payment recorded successfully',
      userId: user.id
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Unexpected error: ${error.message}` 
    }, { status: 500 });
  }
}
