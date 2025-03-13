"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Apprentice {
  id: number
  firstName: string
  lastName: string
  projectTitle: string
}

interface ApprenticeSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (apprenticeId: number) => void
  assignedApprentices: number[]
}

export function ApprenticeSelector({ isOpen, onClose, onSelect, assignedApprentices }: ApprenticeSelectorProps) {
  const [apprentices, setApprentices] = useState<Apprentice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return // Only fetch when the modal is open
    console.log("assigned apprentice", assignedApprentices)
    const fetchApprentices = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/apprentice/active")
        if (!response.ok) throw new Error("Failed to fetch apprentices")
        const data = await response.json()
        console.log(data)
        const apprentices = data.map((apprentice: any) => ({
          id: apprentice.id,
          firstName: apprentice.first_name,
          lastName: apprentice.last_name,
          projectTitle: apprentice.project_title
        }))
        setApprentices(apprentices)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchApprentices()
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Apprentice</DialogTitle>
          <DialogDescription>Choose an apprentice to assign this question to.</DialogDescription>
        </DialogHeader>

        {loading && <p className="text-center text-sm text-muted-foreground">Loading apprentices...</p>}
        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        {!loading && !error && (
          <ScrollArea className="mt-8 max-h-[300px] pr-4">
          {apprentices.map((apprentice) => {
            const isAssigned = assignedApprentices.includes(apprentice.id)

            return (
              <Button
                key={apprentice.id}
                variant={isAssigned ? "secondary" : "outline"}
                className="w-full justify-start mb-2"
                onClick={() => !isAssigned && onSelect(apprentice.id)}
                disabled={isAssigned}
              >
                <div className="text-left">
                  <div>{apprentice.firstName} {apprentice.lastName}</div>
                  <div className="text-sm text-muted-foreground">{apprentice.projectTitle}</div>
                  {isAssigned && <div className="text-xs text-green-600">Already assigned</div>}
                </div>
              </Button>
            )
          })}
        </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}

