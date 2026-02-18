import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Fachbereich } from "@/app/model/Fachbereich"

export function useSubjectBySlug(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Fachbereich>(
    slug ? `/api/subject_area/slug/${slug}` : null,
    fetcher
  )
  return { subject: data ?? null, error, isLoading, mutate }
}
