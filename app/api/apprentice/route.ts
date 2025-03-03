import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'


export async function GET(req: NextRequest) {
    const supabase = await createClient();
    try {
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
      
      if (error) throw error
      
      console.log(data)
      return NextResponse.json(data)
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching questions' }, { status: 500 })
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
      return NextResponse.json({ error: 'Error creating question' }, { status: 500 })
    }
  }
