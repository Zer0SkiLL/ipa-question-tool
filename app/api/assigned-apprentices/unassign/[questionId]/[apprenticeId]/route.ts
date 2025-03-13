import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { handleError } from '@/utils/errorHandler';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ questionId: string, apprenticeId: string }> }
  ) {
    try {
      const { questionId, apprenticeId } = await params;
      const supabase = await createClient();
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();
  
      if (userError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
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
        .delete()
        .match({ apprentice_id: apprenticeId, question_id: questionId });
  
      if (error) throw error;
  
      return NextResponse.json({ message: 'Question successfully unassigned from apprentice' }, { status: 201 });
    } catch (error) {
      const errorResponse = handleError(error, 'Error unassigning question from apprentice');
      return NextResponse.json({ error: errorResponse.message }, { status: 500 });
    }
  }