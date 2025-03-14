import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { handleError } from '@/utils/errorHandler';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('difficulty')
      .select('*');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error fetching difficulties');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { name } = body;

    const { data, error } = await supabase
      .from('difficulty')
      .insert([
        {
          name,
          created_by: req.headers.get('user-id'),
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(data?.[0] ?? null);
  } catch (error) {
    const errorResponse = handleError(error, 'Error creating difficulty');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}
