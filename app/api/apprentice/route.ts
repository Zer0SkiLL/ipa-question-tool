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
        .eq('belongs_to', user.id);
      
      if (error) throw error
      
      console.log(data)
      return NextResponse.json(data)
    } catch (error) {
      const errorResponse = handleError(error, 'Error fetching questions');
      return NextResponse.json({ error: errorResponse.message }, { status: 500 });
    }
  }
  
  export async function POST(req: NextRequest) {
    const supabase = await createClient();
    try {
      const {
          data: { user },
      } = await supabase.auth.getUser()

      const body = await req.json()
      const { firstName: first_name, last_name, workLocation, projectTitle, projectDescription, expertRole, projectTopics } = body;
      
      const { data, error } = await supabase
        .from('question')
        .insert([
          {
            first_name,
            last_name,
            workLocation,
            projectTitle,
            projectDescription,
            expertRole,
            projectTopics,
            belongs_to: user?.id,
            created_at: new Date().toISOString()
          }
        ])
        .select(`
          *,
          difficulty (*),
          topic_complex (*)
        `)
      
      if (error) throw error
      
      return NextResponse.json(data[0])
    } catch (error) {
      const errorResponse = handleError(error, 'Error creating question');
      return NextResponse.json({ error: errorResponse.message }, { status: 500 });
    }
  }
