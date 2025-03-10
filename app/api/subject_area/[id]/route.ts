import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('subject_area')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching subject_area by ID' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const supabase = await createClient();
        const body = await req.json();
        const { name, description, slug } = body;

        console.log('data in post: ', body);
        console.log('id in post: ', id);
        console.log('name in post: ', name);
        console.log('description in post: ', description);
        console.log('slug in post: ', slug);

        const { data, error } = await supabase
            .from('subject_area')
            .update({
                name,
                description,
                slug
            })
            .eq('id', id)
            .select('*')
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error updating subject_area' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const supabase = await createClient();
        const { data, error } = await supabase
        .from('subject_area')
        .delete()
        .eq('id', id)
        .select()
        .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error deleting subject_area' },
            { status: 500 }
        );
    }
}
