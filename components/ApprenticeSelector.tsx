"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Apprentice {
  id: number
  name: string
  projectTitle: string
}

interface ApprenticeSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (apprenticeId: number) => void
}

export function ApprenticeSelector({ isOpen, onClose, onSelect }: ApprenticeSelectorProps) {
  const [apprentices, setApprentices] = useState<Apprentice[]>([])

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    setApprentices([
      { id: 1, name: "John Doe", projectTitle: "E-Commerce Platform" },
      { id: 2, name: "Jane Smith", projectTitle: "Mobile App" },
    ])
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Apprentice</DialogTitle>
          <DialogDescription>Choose an apprentice to assign this question to.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[300px] pr-4">
          {apprentices.map((apprentice) => (
            <Button
              key={apprentice.id}
              variant="outline"
              className="w-full justify-start mb-2"
              onClick={() => onSelect(apprentice.id)}
            >
              <div className="text-left">
                <div>{apprentice.name}</div>
                <div className="text-sm text-muted-foreground">{apprentice.projectTitle}</div>
              </div>
            </Button>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

