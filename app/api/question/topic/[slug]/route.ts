import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { handleError } from "@/utils/errorHandler";

// Get questions by topic slug (resolves ID internally)
export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  try {
    const supabase = await createClient();

    const { slug } = await context.params;

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
        topic_complex (*),
        badges:question_category_badge(
          id,
          category_badge:category_badge_id(id, name)
        )
      `)
      .eq("topic_id", topic.id);
    
    if (questionError) throw questionError
    
    // Transform the badges to a simpler format
    const transformedQuestions = questions.map(question => ({
      ...question,
      badges: question.badges.map((b: { category_badge: { id: any; name: any; }; }) => ({
        id: b.category_badge.id,
        name: b.category_badge.name
      }))
    }))
    
    return NextResponse.json({
      questions: transformedQuestions,
      topicId: topic.id
    })
  } catch (error) {
    const errorResponse = handleError(error, 'Error fetching questions by topic slug');
    return NextResponse.json({ error: errorResponse.message }, { status: 500 });
  }
}
