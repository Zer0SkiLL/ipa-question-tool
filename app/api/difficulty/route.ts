import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('difficulty')
      .select('*');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching difficulties' },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: 'Error creating difficulty' },
      { status: 500 }
    );
  }
}
