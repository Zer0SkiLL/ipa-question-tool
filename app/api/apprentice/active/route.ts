import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { handleError } from '@/utils/errorHandler';


export async function GET() {
    const supabase = await createClient();
    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
          throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('apprentice')
        .select(`
          id,
          belongs_to,
          first_name,
          last_name,
          project_title,
          project_short_description,
          topics,
          expert_role,
          is_active
        `)
        .eq('belongs_to', user.id)
        .eq('is_active', true);
      
      if (error) throw error
      
      return NextResponse.json(data)
    } catch (error) {
      const errorResponse = handleError(error, 'Error fetching apprentice');
      return NextResponse.json({ error: errorResponse.message }, { status: 500 });
    }
  }