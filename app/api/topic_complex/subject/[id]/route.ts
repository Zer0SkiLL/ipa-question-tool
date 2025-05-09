import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { handleError } from '@/utils/errorHandler';

// export async function GET(_: NextRequest, context: { params: { id: string } }) {
export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Id is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('topic_complex')
      .select('*')
      .eq('parent_subject', id);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error fetching topics for subject');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}
