import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { ApprenticeOverview } from "@/app/model/Apprentice"

export function useApprentices() {
  const { data, error, isLoading, mutate } = useSWR<any[]>(
    "/api/apprentice",
    fetcher
  )

  const apprentices: ApprenticeOverview[] = (data ?? []).map((a: any) => ({
    id: a.id,
    firstName: a.first_name,
    lastName: a.last_name,
    projectTitle: a.project_title,
    projectShortDescription: a.project_short_description,
    projectTopics: a.topics || [],
    isActive: a.is_active,
    expertRole: a.expert_role || "Unknown",
  }))

  return { apprentices, error, isLoading, mutate }
}
