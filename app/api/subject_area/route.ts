import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { handleError } from '@/utils/errorHandler';


export async function GET() {
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
      const errorResponse = handleError(error, 'Error fetching subjects');
      return NextResponse.json({ error: errorResponse.message }, { status: 500 });
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
      const errorResponse = handleError(error, 'Error creating subject');
      return NextResponse.json({ error: errorResponse.message }, { status: 500 });
    }
  }