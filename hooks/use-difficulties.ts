import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"

interface Difficulty {
  id: number
  name: string
  level: number
  color: string
}

export function useDifficulties() {
  const { data, error, isLoading } = useSWR<Difficulty[]>(
    "/api/difficulty",
    fetcher
  )
  return { difficulties: data ?? [], error, isLoading }
}
