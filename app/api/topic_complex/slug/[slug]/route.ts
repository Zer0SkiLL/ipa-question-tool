import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('topic_complex')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching topic by slug' },
      { status: 500 }
    );
  }
}
