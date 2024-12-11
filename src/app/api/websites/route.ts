import { auth } from '@clerk/nextjs';
import { clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { WebsiteGeneration, UserWebsiteMetadata } from '@/types/website-generation';

export async function GET() {
  const { userId } = auth();
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const metadata = user.publicMetadata;
    const websites = (metadata as any)?.websites || [];
    
    return NextResponse.json({
      websites,
      totalGenerated: (metadata as any)?.totalGenerated || 0,
      totalSpent: (metadata as any)?.totalSpent || 0
    });
  } catch (error) {
    console.error('Error fetching website history:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = auth();
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { hash, price, isPremium } = await req.json();
    const user = await clerkClient.users.getUser(userId);
    const currentMetadata = user.publicMetadata;

    // Get existing websites or initialize
    const existingWebsites = (currentMetadata as any)?.websites || [];
    const existingTotalSpent = (currentMetadata as any)?.totalSpent || 0;
    const existingTotalGenerated = (currentMetadata as any)?.totalGenerated || 0;

    // Create new website generation record
    const websiteGeneration = {
      ...(hash ? { transactionHash: hash } : {}),  // Only include transactionHash if provided
      ...(price ? { price } : {}),  // Only include price if provided
      timestamp: new Date().toISOString()
    };

    // Update only the website-related fields while preserving all other metadata
    const updatedMetadata = {
      ...currentMetadata,  // Preserve all existing metadata
      websites: [...existingWebsites, websiteGeneration],
      totalGenerated: existingTotalGenerated + 1,
      // Only update totalSpent if there's a price (non-premium generation)
      ...(price ? { totalSpent: existingTotalSpent + price } : {})
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
    console.error('Error recording website generation:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
