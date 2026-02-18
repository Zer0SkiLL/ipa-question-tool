import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { handleError } from '@/utils/errorHandler';
import { checkDemoRestriction } from '@/utils/demo-guard';

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('subject_area')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleError(error, 'Error fetching subject_area by ID');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const demoBlock = await checkDemoRestriction();
        if (demoBlock) return demoBlock;

        const { id } = await params;
        const supabase = await createClient();
        const body = await req.json();
        const { name, description, slug } = body;

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
      const errorResponse = handleError(error, 'Error updating subject_area');
      return NextResponse.json({ error: errorResponse.message }, { status: 500 });
    }
}

export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const demoBlock = await checkDemoRestriction();
        if (demoBlock) return demoBlock;

        const { id } = await params;
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
      const errorResponse = handleError(error, 'Error deleting subject_area');
      return NextResponse.json({ error: errorResponse.message }, { status: 500 });
    }
}
