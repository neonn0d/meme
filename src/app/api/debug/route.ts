import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with admin privileges to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Check users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId);
    
    if (userError) {
      return NextResponse.json({ error: `Error fetching user: ${userError.message}` }, { status: 500 });
    }
    
    // Check user_public_metadata table
    const { data: metadataData, error: metadataError } = await supabaseAdmin
      .from('user_public_metadata')
      .select('*')
      .eq('user_id', userId);
    
    if (metadataError) {
      return NextResponse.json({ error: `Error fetching metadata: ${metadataError.message}` }, { status: 500 });
    }
    
    // Check if tables exist
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      return NextResponse.json({ error: `Error fetching tables: ${tablesError.message}` }, { status: 500 });
    }
    
    // Get table structure
    const { data: columns, error: columnsError } = await supabaseAdmin
      .from('information_schema.columns')
      .select('table_name, column_name, data_type')
      .in('table_name', ['users', 'user_public_metadata']);
    
    if (columnsError) {
      return NextResponse.json({ error: `Error fetching columns: ${columnsError.message}` }, { status: 500 });
    }
    
    // Try to fix the metadata if it doesn't exist
    let fixResult = null;
    if (!metadataData || metadataData.length === 0) {
      const { data: fixData, error: fixError } = await supabaseAdmin
        .from('user_public_metadata')
        .insert({
          user_id: userId,
          payments: [],
          websites: [],
          total_spent: 0,
          total_generated: 0
        })
        .select();
      
      fixResult = { data: fixData, error: fixError };
    }
    
    return NextResponse.json({
      user: userData,
      metadata: metadataData,
      tables: tables,
      columns: columns,
      fix: fixResult
    });
  } catch (error: any) {
    return NextResponse.json({ error: `Unexpected error: ${error.message}` }, { status: 500 });
  }
}
