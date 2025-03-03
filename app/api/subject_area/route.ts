import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'


export async function GET(req: NextRequest) {
  const supabase = await createClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      console.log('user', user);
      console.log('user?.id', user?.id);
      const { data: subject_area, error } = await supabase
        .from('subject_area')
        .select('*')

      console.log(subject_area);
      
      if (error) throw error
      
      return NextResponse.json(subject_area)
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: 'Error fetching subjects' }, { status: 500 })
    }
  }
  
  export async function POST(req: NextRequest) {
    const supabase = await createClient();
    try {
      const body = await req.json()
      const { name, description, slug } = body

      console.log('name', name);
      console.log('description', description);  
      console.log('slug', slug);
      console.log(body);

      const {
        data: { user },
      } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('subject_area')
        .insert([
          { 
            name,
            description,
            slug,
            created_by: user?.id, // Assuming you pass the user ID in headers
            created_at: new Date().toISOString()
          }
        ])
        .select()
      
      if (error) throw error
      
      return NextResponse.json(data[0])
    } catch (error) {
      return NextResponse.json({ error: 'Error creating subject' }, { status: 500 })
    }
  }