import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { handleError } from '@/utils/errorHandler'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()

    if (!q || q.length < 2) {
      return NextResponse.json([])
    }

    const searchPattern = `%${q}%`

    // Run all three searches in parallel
    const [subjectsResult, topicsResult, questionsResult] = await Promise.all([
      supabase
        .from('subject_area')
        .select('id, name, slug')
        .ilike('name', searchPattern)
        .limit(5),
      supabase
        .from('topic_complex')
        .select('id, name, slug, parent_subject:subject_area!parent_subject (id, name, slug)')
        .ilike('name', searchPattern)
        .limit(5),
      supabase
        .from('question')
        .select('id, question, topic_complex (id, name, slug, parent_subject:subject_area!parent_subject (id, name, slug))')
        .ilike('question', searchPattern)
        .limit(10),
    ])

    if (subjectsResult.error) throw subjectsResult.error
    if (topicsResult.error) throw topicsResult.error
    if (questionsResult.error) throw questionsResult.error

    const results = [
      ...(subjectsResult.data ?? []).map((s: any) => ({
        type: 'Fachbereich' as const,
        name: s.name,
        href: `/fachbereich/${s.slug}`,
      })),
      ...(topicsResult.data ?? []).map((t: any) => ({
        type: 'Themenkomplex' as const,
        name: t.name,
        href: `/fachbereich/${t.parent_subject?.slug}/${t.slug}`,
      })),
      ...(questionsResult.data ?? []).map((q: any) => ({
        type: 'Frage' as const,
        name: q.question,
        href: `/fachbereich/${q.topic_complex?.parent_subject?.slug}/${q.topic_complex?.slug}`,
      })),
    ]

    return NextResponse.json(results)
  } catch (error) {
    const errorResponse = handleError(error, 'Error searching')
    return NextResponse.json({ error: errorResponse.message }, { status: 500 })
  }
}
