import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Themenkomplex } from "@/app/model/Themenkomplex"

export function useTopicsBySubject(subjectId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Themenkomplex[]>(
    subjectId ? `/api/topic_complex/subject/${subjectId}` : null,
    fetcher
  )
  return { topics: data ?? [], error, isLoading, mutate }
}
