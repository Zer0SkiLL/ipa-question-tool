import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { handleError } from "@/utils/errorHandler";

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Fetch the topic ID using the slug
    const { data: topic, error: topicError } = await supabase
      .from("topic_complex")
      .select("id")
      .eq("slug", slug)
      .single();

    if (topicError || !topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const { data: questions, error: questionError } = await supabase
      .from('question')
      .select(`
        *,
        difficulty (*),
        topic_complex (*)
      `)
      .eq("topic_id", topic.id);
    
    if (questionError) throw questionError
    
    return NextResponse.json({
      questions: questions,
      topicId: topic.id
    })
  } catch (error) {
    const errorResponse = handleError(error, 'Error fetching questions by topic slug');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}
