import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';

export async function GET() {
  // Check authentication
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get the current user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has premium from public metadata
    const publicMetadata = user.publicMetadata || {};
    const payments = publicMetadata.payments as any[] || [];
    
    // Find active premium subscription
    const now = Date.now();
    const activePremium = payments.find(payment => 
      payment.type === 'premium' && 
      payment.status === 'completed' && 
      payment.expiryDate > now
    );

    return NextResponse.json({
      isSubscribed: !!activePremium,
      // Include additional subscription details if needed
      subscription: activePremium ? {
        expiryDate: activePremium.expiryDate,
        purchaseDate: activePremium.timestamp,
        amount: activePremium.amount
      } : null
    });
  } catch (error: any) {
    console.error('Error checking subscription:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to check subscription status' 
    }, { status: 500 });
  }
}
