import type { ReactNode } from "react"
import { ComingSoon } from "./ComingSoon"

interface FeatureWrapperProps {
  featureKey: string
  title: string
  description?: string
  children: ReactNode
}

export function FeatureWrapper({ featureKey, title, description, children }: FeatureWrapperProps) {
  // You can replace this with your actual feature flag logic
  const isDev = process.env.NODE_ENV === "development";
  const isFeatureEnabled = isDev || process.env.NEXT_PUBLIC_ENABLED_FEATURES?.includes(featureKey)
//   const isFeatureEnabled = true;

  if (isFeatureEnabled) {
    return <>{children}</>
  }

  return <ComingSoon title={title} description={description} />
}

