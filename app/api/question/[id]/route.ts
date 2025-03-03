import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { handleError } from '@/utils/errorHandler';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('question')
      .select(`
          *,
          difficulty (*),
          topic_complex (*)
        `)
      .eq('id', params.id)
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
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;

    const supabase = await createClient();
    const body = await req.json();
    const { question, answer, difficulty_id, topic_id, tags } = body;

    console.log("Received body:", body);
    console.log("Question:", question);
    console.log("Answer:", answer);
    console.log("Difficulty ID:", difficulty_id);
    console.log("Topic ID:", topic_id);
    console.log("Tags:", tags);


    const { data, error } = await supabase
      .from('question')
      .update({
        question,
        answer,
        difficulty: difficulty_id,
        topic_id,
        tags
      })
      .eq('id', id)
      .select(`
          *,
          difficulty (*),
          topic_complex (*)
        `)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error updating question');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('question')
      .delete()
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error deleting question');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}
