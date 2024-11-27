import { auth } from '@clerk/nextjs';
import { clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { PaymentRecord, UserPaymentMetadata } from '@/types/payment';

export async function GET() {
  const { userId } = auth();
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const metadata = user.publicMetadata as unknown as UserPaymentMetadata;
    const payments = metadata?.payments || [];
    
    // Calculate total spent from payments
    const totalSpent = payments.reduce((total, payment) => total + payment.amount, 0);
    
    return NextResponse.json({
      payments,
      totalSpent
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = auth();
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { payment } = await req.json();
    const user = await clerkClient.users.getUser(userId);
    const metadata = user.publicMetadata as unknown as UserPaymentMetadata;

    // Get existing payments or initialize
    const existingPayments = metadata?.payments || [];

    // Create new metadata object with updated payments
    const updatedMetadata = {
      payments: [...existingPayments, payment],
      // Calculate total from all payments including the new one
      totalSpent: [...existingPayments, payment].reduce((total, p) => total + p.amount, 0)
    };

    // Update user metadata in Clerk
    await clerkClient.users.updateUser(userId, {
      publicMetadata: updatedMetadata
    });

    return NextResponse.json({
      success: true,
      metadata: updatedMetadata
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
