import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { handleError } from '@/utils/errorHandler';


export async function GET() {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase
        .from('question')
        .select(`
          *,
          difficulty (*),
          topic_complex (*)
        `)
      
      if (error) throw error
      
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
      const { question, answer, difficulty, topic_id, tags } = body
      
      const { data, error } = await supabase
        .from('question')
        .insert([
          {
            question,
            answer,
            difficulty,
            topic_id,
            tags,
            created_by: user?.id,
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