"use client"

import { use, useState } from "react"
import Link from "next/link"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Breadcrumb } from "@/components/Breadcrumb"
import AddTopicForm from "@/components/AddTopicForm"
import { Themenkomplex } from "../../model/Themenkomplex"
import { EditTopicForm } from "@/components/EditTopicForm"
import { useSubjectBySlug } from "@/hooks/use-subject-by-slug"
import { useTopicsBySubject } from "@/hooks/use-topics-by-subject"

export default function FachbereichPage({ params }: { params: Promise<{ slug: string }> }) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentThemenkomplex, setCurrentThemenkomplex] = useState<Themenkomplex | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { slug } = use(params);

  const { subject: currentSubject } = useSubjectBySlug(slug)
  const { topics, isLoading: loading, mutate: mutateTopics } = useTopicsBySubject(currentSubject?.id ?? null)

  const fachbereichName = slug
    ? slug.replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Laden..."

  const handleAddTopic = async (formData: { name: string; description: string, slug: string }) => {
    if (!currentSubject) return;

    try {
      const topicData = {
        ...formData,
        parent_subject: currentSubject.id
      };

      const res = await fetch("/api/topic_complex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topicData),
      });

      if (!res.ok) throw new Error("Failed to add topic");

      mutateTopics();
      setIsAddOpen(false);
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

  const handleEditTopic = async (formData: { name: string; description: string, slug: string }) => {
    if (!currentThemenkomplex) return;

    try {
      const res = await fetch(`/api/topic_complex/${currentThemenkomplex.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: currentThemenkomplex.id,
          parent_subject: currentSubject?.id
        }),
      });

      if (!res.ok) throw new Error("Failed to update topic");

      mutateTopics();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating topic:", error);
    }
  };

  const handleDeleteTopic = async () => {
    try {
      setDeleteLoading(true);
      if (currentThemenkomplex) {
        const res = await fetch(`/api/topic_complex/${currentThemenkomplex.id}`, {
          method: "DELETE",
        });
        
        if (!res.ok) throw new Error("Failed to delete topic");
        
        setCurrentThemenkomplex(null);
        mutateTopics();
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
    } finally {
      setDeleteLoading(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {slug ? (
        <Breadcrumb items={[{ name: fachbereichName, href: `/fachbereich/${slug}` }]} />
      ) : (
        <p>Laden...</p>
      )}

      <div className="flex justify-between items-center my-8">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">Themenkomplexe</h1>
          <h2 className="text-2xl font-semibold">{fachbereichName}</h2>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Themenkomplex hinzufügen
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading ? (
        [...Array(3)].map((_, index) => (
          <div key={index} className="p-4 border rounded-lg animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))
      ) : topics.length > 0 ? (
          topics.map((themenkomplex) => (
          <Card key={themenkomplex.id} className="relative">
            <CardHeader>
              <CardTitle>{themenkomplex.name}</CardTitle>
              <CardDescription>{themenkomplex.description}</CardDescription>
              <Link href={`/fachbereich/${slug}/${themenkomplex.slug}`} className="absolute inset-0" />
            </CardHeader>
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setCurrentThemenkomplex(themenkomplex)
                  setIsEditOpen(true)
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setCurrentThemenkomplex(themenkomplex)
                  setIsDeleteOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
          </Card>
          ))
        ) : (
          <p>Keine Themen gefunden.</p>
      )}
      </div>

      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Neuen Themenkomplex hinzufügen</SheetTitle>
            <SheetDescription>Geben Sie die Details für den neuen Themenkomplex ein.</SheetDescription>
          </SheetHeader>
          {currentSubject && (
          <AddTopicForm 
              onAdd={handleAddTopic} 
            />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Themenkomplex bearbeiten</SheetTitle>
            <SheetDescription>Bearbeiten Sie die Details des Themenkomplexes.</SheetDescription>
          </SheetHeader>
          {currentThemenkomplex && (
          <EditTopicForm 
            topic={currentThemenkomplex} 
            onEdit={handleEditTopic} 
          />
        )}
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Möchten Sie wirklich den Themenkomplex löschen {currentThemenkomplex?.name} ?</DialogTitle>
            <DialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Der Themenkomplex und alle zugehörigen Daten werden dauerhaft gelöscht.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={deleteLoading}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDeleteTopic} disabled={deleteLoading}>
              {deleteLoading ? "Wird gelöscht..." : "Löschen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
