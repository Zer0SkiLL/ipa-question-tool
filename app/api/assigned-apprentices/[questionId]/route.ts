import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { handleError } from '@/utils/errorHandler';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params;
    const supabase = await createClient();
    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

    // Fetch apprentice IDs belonging to the current user
    const { data: apprentices, error: apprenticeError } = await supabase
      .from('apprentice')
      .select('id')
      .eq('belongs_to', user.id);

    if (apprenticeError) throw apprenticeError;

    const apprenticeIds = apprentices.map(apprentice => apprentice.id);
    console.log("apprentices", apprenticeIds)
    
    // const apprenticeIds = apprentices.map(apprentice => apprentice.id);

    if (apprentices.length === 0) {
      return NextResponse.json([]); // No apprentices found for this user
    }

    // Fetch assigned apprentices for the given question that belong to the current user
    const { data, error } = await supabase
      .from('apprentice_question')
      .select('apprentice_id')
      .eq('question_id', questionId)
      .in('apprentice_id', apprenticeIds
      ); // Filter by apprentices belonging to the user

    if (error) throw error;

    console.log("assigned apprentices", data)

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error fetching assigned apprentices');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body to get the apprentice ID
    const body = await req.json();
    const { apprenticeId } = body;

    console.log("apprenticeId", apprenticeId)

    if (!apprenticeId) {
      return NextResponse.json({ error: 'Apprentice ID is required' }, { status: 400 });
    }

    // Check if the apprentice belongs to the current user
    const { data: apprentices, error: apprenticeError } = await supabase
      .from('apprentice')
      .select('id')
      .eq('belongs_to', user.id)
      .eq('id', apprenticeId);

    if (apprenticeError) throw apprenticeError;

    if (apprentices.length === 0) {
      return NextResponse.json({ error: 'Apprentice not found or does not belong to the user' }, { status: 404 });
    }

    // Assign the question to the apprentice
    const { data, error } = await supabase
      .from('apprentice_question')
      .insert([
        {
          question_id: questionId,
          apprentice_id: apprenticeId
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ message: 'Question successfully assigned to apprentice' }, { status: 201 });
  } catch (error) {
    const errorResponse = handleError(error, 'Error assigning question to apprentice');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}
