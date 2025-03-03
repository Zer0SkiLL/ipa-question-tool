import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { handleError } from '@/utils/errorHandler';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('topic_complex')
      .select('*');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error fetching topic_complex');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { name, description, slug, parent_subject } = body;

    console.log('data in post: ', body);
    
    const {
        data: { user },
    } = await supabase.auth.getUser()

    console.log('user: ', user);


    const { data, error } = await supabase
      .from('topic_complex')
      .insert([
        {
            name,
            description,
            slug,
            parent_subject,
            created_by: user?.id,
            created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(data?.[0] ?? null);
  } catch (error) {
    const errorResponse = handleError(error, 'Error creating topic_complex');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}
