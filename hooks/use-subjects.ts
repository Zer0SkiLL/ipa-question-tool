import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"

interface Subject {
  id: string
  name: string
  description: string
  slug: string
}

export function useSubjects() {
  const { data, error, isLoading, mutate } = useSWR<Subject[]>(
    "/api/subject_area",
    fetcher
  )
  return { subjects: data ?? [], error, isLoading, mutate }
}
