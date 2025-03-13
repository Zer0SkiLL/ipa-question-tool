import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { handleError } from '@/utils/errorHandler';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('question')
      .select(`
          *,
          difficulty (*),
          topic_complex (*)
        `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error fetching question by ID');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createClient();
    const body = await req.json();
    const { comment } = body;

    console.log("Received body:", body);
    console.log("Comment:", comment);

    const { data, error } = await supabase
      .from('apprentice_question')
      .update({
        comment: comment
      })
      .eq('question_id', id)
      .select(`
          *
        `)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error updating comment in question');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}