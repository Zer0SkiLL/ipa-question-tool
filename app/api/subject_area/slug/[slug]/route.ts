import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { handleError } from '@/utils/errorHandler';

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  try {
    const { slug } = await context.params;

    console.log('slug: ', slug);

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('subject_area')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error fetching subject_area by slug');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}
