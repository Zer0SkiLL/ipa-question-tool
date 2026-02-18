import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { handleError } from '@/utils/errorHandler';
import { checkDemoRestriction } from '@/utils/demo-guard';

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
    const demoBlock = await checkDemoRestriction();
    if (demoBlock) return demoBlock;

    const { id } = await params;

    const supabase = await createClient();
    const body = await req.json();
    const { question, answer, difficulty_id, topic_id, tags } = body;

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const demoBlock = await checkDemoRestriction();
    if (demoBlock) return demoBlock;

    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('question')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error deleting question');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}
