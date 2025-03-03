import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'


export async function GET(req: NextRequest) {
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
      return NextResponse.json({ error: 'Error creating question' }, { status: 500 })
    }
  }