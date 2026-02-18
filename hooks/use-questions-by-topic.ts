import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Question } from "@/app/model/Question"

interface TopicQuestionsResponse {
  questions: Question[]
  topicId: string
}

export function useQuestionsByTopic(topicSlug: string | null) {
  const { data, error, isLoading, mutate } = useSWR<TopicQuestionsResponse>(
    topicSlug ? `/api/question/topic/${topicSlug}` : null,
    fetcher
  )
  return {
    questions: data?.questions ?? [],
    topicId: data?.topicId ?? null,
    error,
    isLoading,
    mutate,
  }
}
