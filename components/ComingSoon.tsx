import { CalendarClock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ComingSoonProps {
  title: string
  description?: string
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex items-center justify-center min-h-[88vh] bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{title}</CardTitle>
          <CardDescription>{description || "This feature is coming soon!"}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <CalendarClock className="w-24 h-24 text-primary mb-4" />
          <p className="text-center text-muted-foreground">
            We're working hard to bring you this feature. Please check back later!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

