import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"

export function useActiveApprentices(shouldFetch: boolean) {
  const { data, error, isLoading } = useSWR(
    shouldFetch ? "/api/apprentice/active" : null,
    fetcher
  )
  return { apprentices: data ?? [], error, isLoading }
}
