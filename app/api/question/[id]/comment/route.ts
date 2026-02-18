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
    const { comment, apprenticeId, score, isAsked } = body;

    const updateData: Record<string, any> = {};
    if (comment !== undefined) updateData.comment = comment;
    if (score !== undefined) updateData.score = score;
    if (isAsked !== undefined) updateData.is_asked = isAsked;

    const { data, error } = await supabase
      .from('apprentice_question')
      .update(updateData)
      .eq('question_id', id)
      .eq('apprentice_id', apprenticeId)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error updating comment in question');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}