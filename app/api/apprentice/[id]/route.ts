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
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('apprentice')
      .select(`
          *,
          apprentice_question (
          *,
            question (
              *,
              difficulty (*),
              topic_complex (
                *,
                parent_subject (*)
              )
            )
          )
        `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'Apprentice not found' }, { status: 404 });
    }

    if (user?.id !== data.belongs_to) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error fetching apprentice by ID');
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
    const { firstName: first_name, lastName: last_name, workLocation: address_link, projectTitle: project_title, projectDescription: project_short_description, expertRole: expert_role, projectTopics: topics, isActive: is_active } = body;


    const { data, error } = await supabase
      .from('apprentice')
      .update({
        first_name,
        last_name,
        address_link,
        project_title,
        project_short_description,
        expert_role,
        topics,
        is_active,
      })
      .eq('id', id)
      .select(`
          *,
          apprentice_question (*)
        `)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error updating apprentice');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('apprentice')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error deleting apprentice');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}
