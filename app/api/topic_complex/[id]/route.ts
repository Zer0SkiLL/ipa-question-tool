import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { handleError } from '@/utils/errorHandler';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const supabase = await createClient();
        const { data, error } = await supabase
        .from('topic_complex')
        .select('*')
        .eq('id', id)
        .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
      const errorResponse = handleError(error, 'Error fetching topic_complex by ID');
      return NextResponse.json({ error: errorResponse.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const supabase = await createClient();
        const body = await req.json();
        const { name, description, subject_id } = body;

        const { data, error } = await supabase
        .from('topic_complex')
        .update({
            name,
            description,
            subject_id,
        })
        .eq('id', id)
        .select()
        .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
      const errorResponse = handleError(error, 'Error updating topic_complex');
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
      .from('topic_complex')
      .delete()
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error deleting topic_complex');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}
