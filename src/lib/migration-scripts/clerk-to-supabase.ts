/**
 * Migration script to export data from Clerk and import into Supabase
 * 
 * This script should be run as a one-time operation during the migration process.
 * It requires both Clerk and Supabase API keys to be set in the environment.
 * 
 * Usage:
 * 1. Set CLERK_API_KEY in .env.local
 * 2. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 * 3. Run with: npx ts-node -r dotenv/config src/lib/migration-scripts/clerk-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Clerk API key
const CLERK_API_KEY = process.env.CLERK_API_KEY;

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Temporary directory for exported data
const EXPORT_DIR = path.join(__dirname, 'clerk-export');

/**
 * Main migration function
 */
async function migrateClerkToSupabase() {
  try {
    console.log('Starting migration from Clerk to Supabase...');
    
    // Create export directory if it doesn't exist
    if (!fs.existsSync(EXPORT_DIR)) {
      fs.mkdirSync(EXPORT_DIR, { recursive: true });
    }
    
    // Step 1: Export users from Clerk
    console.log('Exporting users from Clerk...');
    const users = await exportClerkUsers();
    console.log(`Exported ${users.length} users from Clerk`);
    
    // Step 2: Transform user data for Supabase
    console.log('Transforming user data for Supabase...');
    const transformedUsers = transformUsersForSupabase(users);
    
    // Step 3: Import users into Supabase
    console.log('Importing users into Supabase...');
    await importUsersToSupabase(transformedUsers);
    
    // Step 4: Export and import user metadata
    console.log('Migrating user metadata...');
    await migrateUserMetadata(users);
    
    // Step 5: Verify migration
    console.log('Verifying migration...');
    await verifyMigration(users);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

/**
 * Export users from Clerk
 */
async function exportClerkUsers() {
  if (!CLERK_API_KEY) {
    throw new Error('CLERK_API_KEY is not set in environment variables');
  }
  
  // Use Clerk API to fetch users
  const response = await fetch('https://api.clerk.dev/v1/users', {
    headers: {
      'Authorization': `Bearer ${CLERK_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch users from Clerk: ${response.statusText}`);
  }
  
  const data = await response.json();
  const users = data.data || [];
  
  // Save users to file for backup
  fs.writeFileSync(
    path.join(EXPORT_DIR, 'clerk-users.json'),
    JSON.stringify(users, null, 2)
  );
  
  return users;
}

/**
 * Transform Clerk user data for Supabase
 */
function transformUsersForSupabase(clerkUsers: any[]) {
  return clerkUsers.map(user => {
    // Extract primary email
    const primaryEmail = user.email_addresses.find(
      (email: any) => email.id === user.primary_email_address_id
    );
    
    // Extract primary phone number
    const primaryPhone = user.phone_numbers.find(
      (phone: any) => phone.id === user.primary_phone_number_id
    );
    
    // Get first and last name
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    
    // For this migration, we'll use a placeholder wallet address
    // Users will need to connect their wallet on first login
    const placeholderWalletAddress = `placeholder-${user.id}`;
    
    return {
      clerk_id: user.id,
      wallet_address: placeholderWalletAddress,
      email: primaryEmail ? primaryEmail.email_address : null,
      phone: primaryPhone ? primaryPhone.phone_number : null,
      first_name: firstName,
      last_name: lastName,
      created_at: user.created_at,
      updated_at: user.updated_at,
      // Extract public metadata
      public_metadata: user.public_metadata || {},
      // Extract private metadata
      private_metadata: user.private_metadata || {}
    };
  });
}

/**
 * Import transformed users into Supabase
 */
async function importUsersToSupabase(transformedUsers: any[]) {
  // Process users in batches to avoid hitting API limits
  const BATCH_SIZE = 10;
  
  for (let i = 0; i < transformedUsers.length; i += BATCH_SIZE) {
    const batch = transformedUsers.slice(i, i + BATCH_SIZE);
    
    // Insert users
    const { data: users, error } = await supabase
      .from('users')
      .insert(batch.map(user => ({
        wallet_address: user.wallet_address,
        clerk_id: user.clerk_id
      })))
      .select();
    
    if (error) {
      throw new Error(`Failed to insert users into Supabase: ${error.message}`);
    }
    
    console.log(`Imported batch of ${batch.length} users (${i + 1} to ${i + batch.length} of ${transformedUsers.length})`);
    
    // Map Clerk IDs to Supabase IDs
    const userIdMap = new Map();
    users.forEach((user: any, index: number) => {
      userIdMap.set(batch[index].clerk_id, user.id);
    });
    
    // Now insert metadata for these users
    await insertUserMetadata(batch, userIdMap);
  }
}

/**
 * Insert user metadata into Supabase
 */
async function insertUserMetadata(users: any[], userIdMap: Map<string, string>) {
  const publicMetadataEntries = [];
  const privateMetadataEntries = [];
  
  for (const user of users) {
    const supabaseUserId = userIdMap.get(user.clerk_id);
    if (!supabaseUserId) continue;
    
    // Prepare public metadata
    publicMetadataEntries.push({
      user_id: supabaseUserId,
      websites: user.public_metadata.websites || [],
      total_generated: user.public_metadata.total_generated || 0,
      total_spent: user.public_metadata.total_spent || 0,
      payments: user.public_metadata.payments || []
    });
    
    // Prepare private metadata
    privateMetadataEntries.push({
      user_id: supabaseUserId,
      telegram_sessions: user.private_metadata.telegram_sessions || []
    });
  }
  
  // Insert public metadata
  if (publicMetadataEntries.length > 0) {
    const { error: publicError } = await supabase
      .from('user_public_metadata')
      .insert(publicMetadataEntries);
    
    if (publicError) {
      throw new Error(`Failed to insert public metadata: ${publicError.message}`);
    }
  }
  
  // Insert private metadata
  if (privateMetadataEntries.length > 0) {
    const { error: privateError } = await supabase
      .from('user_private_metadata')
      .insert(privateMetadataEntries);
    
    if (privateError) {
      throw new Error(`Failed to insert private metadata: ${privateError.message}`);
    }
  }
}

/**
 * Migrate user metadata from Clerk to Supabase
 */
async function migrateUserMetadata(clerkUsers: any[]) {
  // Get all users from Supabase
  const { data: supabaseUsers, error } = await supabase
    .from('users')
    .select('id, clerk_id');
  
  if (error) {
    throw new Error(`Failed to fetch users from Supabase: ${error.message}`);
  }
  
  // Create a map of Clerk IDs to Supabase IDs
  const userIdMap = new Map();
  supabaseUsers.forEach((user: any) => {
    if (user.clerk_id) {
      userIdMap.set(user.clerk_id, user.id);
    }
  });
  
  // Migrate subscriptions
  console.log('Migrating subscriptions...');
  await migrateSubscriptions(clerkUsers, userIdMap);
  
  // Migrate websites
  console.log('Migrating websites...');
  await migrateWebsites(clerkUsers, userIdMap);
}

/**
 * Migrate subscriptions from Clerk to Supabase
 */
async function migrateSubscriptions(clerkUsers: any[], userIdMap: Map<string, string>) {
  const subscriptions = [];
  
  for (const user of clerkUsers) {
    const supabaseUserId = userIdMap.get(user.id);
    if (!supabaseUserId) continue;
    
    // Check if user has subscription data in metadata
    const subscription = user.public_metadata?.subscription;
    if (subscription && subscription.status === 'active') {
      subscriptions.push({
        user_id: supabaseUserId,
        status: subscription.status,
        plan: subscription.plan || 'monthly',
        current_period_start: subscription.current_period_start || new Date().toISOString(),
        current_period_end: subscription.current_period_end || new Date().toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end || false
      });
    }
  }
  
  // Insert subscriptions
  if (subscriptions.length > 0) {
    const { error } = await supabase
      .from('subscriptions')
      .insert(subscriptions);
    
    if (error) {
      throw new Error(`Failed to insert subscriptions: ${error.message}`);
    }
    
    console.log(`Migrated ${subscriptions.length} subscriptions`);
  } else {
    console.log('No subscriptions to migrate');
  }
}

/**
 * Migrate websites from Clerk to Supabase
 */
async function migrateWebsites(clerkUsers: any[], userIdMap: Map<string, string>) {
  const websites = [];
  
  for (const user of clerkUsers) {
    const supabaseUserId = userIdMap.get(user.id);
    if (!supabaseUserId) continue;
    
    // Check if user has websites in metadata
    const userWebsites = user.public_metadata?.websites || [];
    
    for (const website of userWebsites) {
      websites.push({
        user_id: supabaseUserId,
        template_id: website.templateId || 'modern',
        coin_name: website.coinName || '',
        description: website.description || '',
        ticker: website.ticker || '',
        website_url: website.websiteUrl || '',
        telegram_url: website.telegramUrl || '',
        twitter_url: website.twitterUrl || '',
        contract_address: website.contractAddress || '',
        logo_url: website.logoUrl || '',
        created_at: website.createdAt || new Date().toISOString()
      });
    }
  }
  
  // Insert websites
  if (websites.length > 0) {
    // Process in batches to avoid hitting API limits
    const BATCH_SIZE = 20;
    
    for (let i = 0; i < websites.length; i += BATCH_SIZE) {
      const batch = websites.slice(i, i + BATCH_SIZE);
      
      const { error } = await supabase
        .from('websites')
        .insert(batch);
      
      if (error) {
        throw new Error(`Failed to insert websites batch: ${error.message}`);
      }
    }
    
    console.log(`Migrated ${websites.length} websites`);
  } else {
    console.log('No websites to migrate');
  }
}

/**
 * Verify the migration by comparing counts
 */
async function verifyMigration(clerkUsers: any[]) {
  // Count users in Supabase
  const { count: userCount, error: userError } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true });
  
  if (userError) {
    throw new Error(`Failed to count users in Supabase: ${userError.message}`);
  }
  
  // Count metadata entries
  const { count: metadataCount, error: metadataError } = await supabase
    .from('user_public_metadata')
    .select('id', { count: 'exact', head: true });
  
  if (metadataError) {
    throw new Error(`Failed to count metadata in Supabase: ${metadataError.message}`);
  }
  
  // Count subscriptions
  const { count: subscriptionCount, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('id', { count: 'exact', head: true });
  
  if (subscriptionError) {
    throw new Error(`Failed to count subscriptions in Supabase: ${subscriptionError.message}`);
  }
  
  // Count websites
  const { count: websiteCount, error: websiteError } = await supabase
    .from('websites')
    .select('id', { count: 'exact', head: true });
  
  if (websiteError) {
    throw new Error(`Failed to count websites in Supabase: ${websiteError.message}`);
  }
  
  // Print verification results
  console.log('Migration verification:');
  console.log(`- Clerk users: ${clerkUsers.length}`);
  console.log(`- Supabase users: ${userCount || 0}`);
  console.log(`- User metadata entries: ${metadataCount || 0}`);
  console.log(`- Subscriptions: ${subscriptionCount || 0}`);
  console.log(`- Websites: ${websiteCount || 0}`);
  
  // Check if counts match
  if ((userCount || 0) !== clerkUsers.length) {
    console.warn(`Warning: User count mismatch (Clerk: ${clerkUsers.length}, Supabase: ${userCount || 0})`);
  }
  
  if ((metadataCount || 0) !== (userCount || 0)) {
    console.warn(`Warning: Metadata count mismatch (Users: ${userCount || 0}, Metadata: ${metadataCount || 0})`);
  }
}

// Run the migration
migrateClerkToSupabase().catch(console.error);
