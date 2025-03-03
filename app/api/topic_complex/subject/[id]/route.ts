import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    try {
      const { id } = await context.params;
  
      if (!id) {
        return NextResponse.json({ error: 'Id is required' }, { status: 400 });
      }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('topic_complex')
      .select('*')
      .eq('parent_subject', id);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching topics for subject' },
      { status: 500 }
    );
  }
}
