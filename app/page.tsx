"use client"

import { useState } from "react"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import SearchAutocomplete from "@/components/SearchAutocomplete"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"
import AddSubjectForm from "@/components/AddSubjectForm"
import EditSubjectForm from "@/components/EditSubjectForm"
import { useDemoMode } from "@/components/DemoModeProvider"
import { useSubjects } from "@/hooks/use-subjects"

interface Fachbereich {
  id: string
  name: string
  description: string
  slug: string
}

export default function Home() {
  const isDemoMode = useDemoMode()
  const { subjects, isLoading: loading, mutate } = useSubjects()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentFachbereich, setCurrentFachbereich] = useState<Fachbereich | null>(null)

  const handleAddSubject = async (subjectData: { name: string; description: string; slug: string}) => {
    try {
      const res = await fetch("/api/subject_area", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectData),
      });

      if (!res.ok) {
        throw new Error("Failed to add subject");
      }

      mutate();
    } catch (error) {
      console.error("Error adding subject:", error);
    }

    setIsAddOpen(false);
  }

  const handleEditSubject = async (subjectData: { name: string; description: string; slug: string}) => {
    try {
      const res = await fetch(`/api/subject_area/${currentFachbereich?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectData),
      });

      if (!res.ok) {
        throw new Error("Failed to update subject");
      }

      mutate();
    } catch (error) {
      console.error("Error updating subject:", error);
    } finally {
      setIsEditOpen(false);
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      if (currentFachbereich) {
        const res = await fetch(`/api/subject_area/${currentFachbereich?.id}`, {
          method: "DELETE",
        });
        
        if (!res.ok) {
          throw new Error("Failed to delete subject");
        }
        
        setCurrentFachbereich(null)
        mutate();
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false)
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">IPA Fachgespräch Fragen-Tool</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Fragen suchen</h2>
        <SearchAutocomplete />
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Nach Fachbereich durchsuchen</h2>
        {!isDemoMode && (
        <Button onClick={() => setIsAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Fachbereich hinzufügen
        </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        { loading ? (
          // Skeleton Loading
          [...Array(3)].map((_, index) => (
            <div key={index} className="p-4 border rounded-lg animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : subjects.length > 0 ? (
          subjects.map((fachbereich) => (
            <Card key={fachbereich.id} className="relative">
              <Link href={`/fachbereich/${fachbereich.slug}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {fachbereich.name}</span>
              </Link>
              <CardHeader>
                <CardTitle>{fachbereich.name}</CardTitle>
                <CardDescription>{fachbereich.description}</CardDescription>
              </CardHeader>
              {!isDemoMode && (
              <div className="absolute top-2 right-2 flex gap-2 z-20">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentFachbereich(fachbereich)
                    setIsEditOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentFachbereich(fachbereich)
                    setIsDeleteOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              )}
            </Card>
          ))
        ) : (
          <p>Keine Themen gefunden.</p>
        )}
      </div>

      {!isDemoMode && (
      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Neuen Fachbereich hinzufügen</SheetTitle>
            <SheetDescription>Geben Sie die Details für den neuen Fachbereich ein.</SheetDescription>
          </SheetHeader>
          <AddSubjectForm onAdd={handleAddSubject} />
        </SheetContent>
      </Sheet>
      )}

      {!isDemoMode && (
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Fachbereich bearbeiten</SheetTitle>
            <SheetDescription>Bearbeiten Sie die Details des Fachbereichs.</SheetDescription>
          </SheetHeader>
          {currentFachbereich && (
            <EditSubjectForm 
              subject={currentFachbereich} 
              onEdit={handleEditSubject} 
            />
          )}
        </SheetContent>
      </Sheet>
      )}

      {!isDemoMode && (
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Möchten Sie den Fachbereich {currentFachbereich?.name} wirklich löschen?</DialogTitle>
            <DialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Der Fachbereich und alle zugehörigen Daten werden dauerhaft gelöscht.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Wird gelöscht..." : "Löschen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
    </div>
  )
}
