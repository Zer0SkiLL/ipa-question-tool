"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface BadgeManagerProps {
  badges: string[]
  onAddBadge: (badge: string) => void
  onRemoveBadge: (badge: string) => void
}

export function BadgeManager({ badges, onAddBadge, onRemoveBadge }: BadgeManagerProps) {
  const [newBadge, setNewBadge] = useState("")

  const handleAddBadge = () => {
    if (newBadge.trim()) {
      onAddBadge(newBadge.trim())
      setNewBadge("")
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input type="text" value={newBadge} onChange={(e) => setNewBadge(e.target.value)} placeholder="Add new badge" />
        <Button onClick={handleAddBadge}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <div
            key={badge}
            className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
          >
            {badge}
            <Button variant="ghost" size="sm" className="ml-1 h-4 w-4 p-0" onClick={() => onRemoveBadge(badge)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

