"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useActiveApprentices } from "@/hooks/use-active-apprentices"

interface ApprenticeSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (apprenticeId: number) => void
  assignedApprentices: number[]
}

export function ApprenticeSelector({ isOpen, onClose, onSelect, assignedApprentices }: ApprenticeSelectorProps) {
  const { apprentices: rawApprentices, isLoading: loading, error } = useActiveApprentices(isOpen)

  const apprentices = (rawApprentices ?? []).map((a: any) => ({
    id: a.id,
    firstName: a.first_name,
    lastName: a.last_name,
    projectTitle: a.project_title,
  }))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lernende/n auswählen</DialogTitle>
          <DialogDescription>Wählen Sie eine/n Lernende/n aus, um diese Frage zuzuweisen.</DialogDescription>
        </DialogHeader>

        {loading && <p className="text-center text-sm text-muted-foreground">Lernende werden geladen...</p>}
        {error && <p className="text-center text-sm text-red-500">{error.message}</p>}

        {!loading && !error && (
          <ScrollArea className="mt-8 max-h-[300px] pr-4">
          {apprentices.map((apprentice: any) => {
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
                  {isAssigned && <div className="text-xs text-green-600">Bereits zugewiesen</div>}
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
