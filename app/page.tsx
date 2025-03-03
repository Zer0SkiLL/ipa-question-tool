"use client"

import { useEffect, useState } from "react"
import { Search, PlusCircle, Edit, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { z } from "zod";
import AddSubjectForm from "@/components/AddSubjectForm"
import EditSubjectForm from "@/components/EditSubjectForm"

interface Fachbereich {
  id: string
  name: string
  description: string
  slug: string
}

export const fachbereichSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
});

const initialFachbereiche: Fachbereich[] = [
  { id: "1", name: "C#", description: "C# programming language", slug: "csharp" },
  { id: "2", name: "Testing", description: "Software testing methodologies", slug: "testing" },
  { id: "3", name: "SQL", description: "Database management and queries", slug: "sql" },
  { id: "4", name: "Networking", description: "Computer networking concepts", slug: "networking" },
  { id: "5", name: "Web Development", description: "Web technologies and frameworks", slug: "web-development" },
]

export default function Home() {
  // const [fachbereiche, setFachbereiche] = useState<Fachbereich[]>(initialFachbereiche)
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Fachbereich[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentFachbereich, setCurrentFachbereich] = useState<Fachbereich | null>(null)
  const [newFachbereich, setNewFachbereich] = useState<Omit<Fachbereich, "id">>({ name: "", description: "", slug: "" })

  const refreshSubjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/subject_area");
      const data = await res.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    refreshSubjects();
  }, []);

  // const handleAddSubject = () => {
  //   const id = (fachbereiche.length + 1).toString()
  //   setFachbereiche([...fachbereiche, { id, ...newFachbereich }])
  //   setNewFachbereich({ name: "", description: "", slug: "" })
  //   setIsAddOpen(false)
  // }

  const handleAddSubject = async (subjectData: any) => {
    try {
      const res = await fetch("/api/subject_area", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectData),
      });

      if (!res.ok) {
        throw new Error("Failed to add subject");
      }

      const newSubject = await res.json();
      console.log("Subject added:", newSubject);
      refreshSubjects(); // Refresh the list
    } catch (error) {
      console.error("Error adding subject:", error);
    }

    setIsAddOpen(false);
  }

  const handleEditSubject = async (subjectData: any) => {
    try {
      const res = await fetch(`/api/subject_area/${currentFachbereich?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectData),
      });

      if (!res.ok) {
        throw new Error("Failed to update subject");
      }

      const updatedSubject = await res.json();
      console.log("Subject updated:", updatedSubject);
      // refreshSubjects(); // Refresh the list
      setSubjects(prev => prev.map(q => q.id === currentFachbereich?.id ? updatedSubject : q))
    } catch (error) {
      console.error("Error updating subject:", error);
    } finally {
      setIsEditOpen(false);
    }
  }

  // const handleEdit = () => {
  //   if (currentFachbereich) {
  //     setFachbereiche(fachbereiche.map((f) => (f.id === currentFachbereich.id ? currentFachbereich : f)))
  //     setIsEditOpen(false)
  //   }
  // }

  // const handleDelete = () => {
  //   if (currentFachbereich) {
  //     setFachbereiche(fachbereiche.filter((f) => f.id !== currentFachbereich.id))
  //     setIsDeleteOpen(false)
  //   }
  // }

  const handleDelete = async () => {
    try {
      setLoading(true);
      if (currentFachbereich) {
        // setFachbereiche(fachbereiche.filter((f) => f.id !== currentFachbereich.id))
        
        const res = await fetch(`/api/subject_area/${currentFachbereich?.id}`, {
          method: "DELETE",
        });
        
        if (!res.ok) {
          throw new Error("Failed to delete subject");
        }
        
        console.log("Deleted subject:", currentFachbereich?.id);
        setCurrentFachbereich(null)
        refreshSubjects(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
    } finally {
      setLoading(false);
      setIsDeleteOpen(false)
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">IT Apprentice Exam Questions</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Search Questions</h2>
        <div className="flex gap-2">
          <Input type="text" placeholder="Enter keywords..." className="flex-grow" />
          <Button>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Browse by Fachbereich</h2>
        <Button onClick={() => setIsAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Fachbereich
        </Button>
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
            </Card>
          ))
        ) : (
          <p>No topics found.</p>
        )}
      </div>

      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add New Fachbereich</SheetTitle>
            <SheetDescription>Enter the details for the new Fachbereich.</SheetDescription>
          </SheetHeader>
          {/* <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newFachbereich.name}
                onChange={(e) => setNewFachbereich({ ...newFachbereich, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newFachbereich.description}
                onChange={(e) => setNewFachbereich({ ...newFachbereich, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <Input
                id="slug"
                value={newFachbereich.slug}
                onChange={(e) => setNewFachbereich({ ...newFachbereich, slug: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div> */}
          {/* <AddSubjectForm
            onSuccess={() => {
              setIsAddOpen(false);
              refreshSubjects(); // Refresh after successful creation
            }}
          /> */}
          <AddSubjectForm onAdd={handleAddSubject} />
          {/* <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" onClick={handleAdd}>
                Save
              </Button>
            </SheetClose>
          </SheetFooter> */}
        </SheetContent>
      </Sheet>

      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Fachbereich</SheetTitle>
            <SheetDescription>Modify the details of the Fachbereich.</SheetDescription>
          </SheetHeader>
          {/* <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={currentFachbereich?.name}
                onChange={(e) => setCurrentFachbereich((curr) => (curr ? { ...curr, name: e.target.value } : null))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Input
                id="edit-description"
                value={currentFachbereich?.description}
                onChange={(e) =>
                  setCurrentFachbereich((curr) => (curr ? { ...curr, description: e.target.value } : null))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-slug" className="text-right">
                Slug
              </Label>
              <Input
                id="edit-slug"
                value={currentFachbereich?.slug}
                onChange={(e) => setCurrentFachbereich((curr) => (curr ? { ...curr, slug: e.target.value } : null))}
                className="col-span-3"
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" onClick={handleEdit}>
                Save Changes
              </Button>
            </SheetClose>
          </SheetFooter> */}
          {currentFachbereich && (
            <EditSubjectForm 
              subject={currentFachbereich} 
              onEdit={handleEditSubject} 
            />
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete {currentFachbereich?.name} Fachbereich?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the Fachbereich and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

