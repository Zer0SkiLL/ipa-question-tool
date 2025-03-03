"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Breadcrumb } from "@/components/Breadcrumb"
import AddTopicForm from "@/components/AddTopicForm"
import { Themenkomplex } from "../../model/Themenkomplex"
import { Fachbereich } from "@/app/model/Fachbereich"
import { EditTopicForm } from "@/components/EditTopicForm"

const initialThemenkomplexe: Record<string, Themenkomplex[]> = {
  csharp: [
    { id: "1", name: "General", description: "General C# concepts", slug: "general" },
    { id: "2", name: "Error Handling", description: "Error handling in C#", slug: "error-handling" },
    { id: "3", name: "Logging", description: "Logging in C# applications", slug: "logging" },
    { id: "4", name: "LINQ", description: "Language Integrated Query", slug: "linq" },
    { id: "5", name: "Async Programming", description: "Asynchronous programming in C#", slug: "async-programming" },
  ],
  testing: [
    { id: "6", name: "Unit Testing", description: "Unit testing techniques", slug: "unit-testing" },
    {
      id: "7",
      name: "Integration Testing",
      description: "Integration testing strategies",
      slug: "integration-testing",
    },
    { id: "8", name: "Test-Driven Development", description: "Test-driven development practices", slug: "tdd" },
    { id: "9", name: "Mocking", description: "Mocking frameworks and techniques", slug: "mocking" },
  ],
  sql: [
    { id: "10", name: "Basic Queries", description: "Fundamental SQL queries", slug: "basic-queries" },
    { id: "11", name: "Joins", description: "Different types of SQL joins", slug: "joins" },
    { id: "12", name: "Indexing", description: "Database indexing strategies", slug: "indexing" },
    {
      id: "13",
      name: "Stored Procedures",
      description: "Creating and using stored procedures",
      slug: "stored-procedures",
    },
  ],
  networking: [
    { id: "14", name: "OSI Model", description: "Understanding the OSI model", slug: "osi-model" },
    { id: "15", name: "TCP/IP", description: "TCP/IP protocol suite", slug: "tcp-ip" },
    { id: "16", name: "Subnetting", description: "IP subnetting techniques", slug: "subnetting" },
    {
      id: "17",
      name: "Network Security",
      description: "Network security concepts and practices",
      slug: "network-security",
    },
  ],
  "web-development": [
    { id: "18", name: "HTML", description: "HTML fundamentals", slug: "html" },
    { id: "19", name: "CSS", description: "CSS styling", slug: "css" },
    { id: "20", name: "JavaScript", description: "JavaScript programming", slug: "javascript" },
    { id: "21", name: "React", description: "React framework", slug: "react" },
    { id: "22", name: "Node.js", description: "Node.js runtime environment", slug: "nodejs" },
  ],
}

export default function FachbereichPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slugParam, setSlugParam] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);
  const [themenkomplexe, setThemenkomplexe] = useState<Themenkomplex[]>([])
  const [topics, setTopics] = useState<Themenkomplex[]>([])
  const [currentSubject, setCurrentSubject] = useState<Fachbereich | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentThemenkomplex, setCurrentThemenkomplex] = useState<Themenkomplex | null>(null)
  const [newThemenkomplex, setNewThemenkomplex] = useState<Omit<Themenkomplex, "id">>({
    name: "",
    description: "",
    slug: "",
  })

  const { slug } = use(params);

  useEffect(() => {
    if (slug) {
      setSlugParam(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
  
    const getSubjectBySlug = async () => {
      try {
        const res = await fetch(`/api/subject_area/slug/${slug}`);
        const data = await res.json();
        setCurrentSubject(data);
        console.log("fetch subjects by slug", data);
      } catch (error) {
        console.error("Error fetching subject:", error);
      }
    };
  
    getSubjectBySlug();
  }, [slug]);

    const refreshTopics = async () => {
      if (!currentSubject) return;

      setLoading(true);
    
      try {
        const res = await fetch(`/api/topic_complex/subject/${currentSubject.id}`);
        const data = await res.json();
        setTopics(data);
        console.log("Fetched topics:", data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    
    useEffect(() => {
      if (currentSubject) {
        refreshTopics();
      }
    }, [currentSubject]); 

  const fachbereichName = slug
    ? slug.replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Loading..."



  const handleAddTopic = async (formData: any) => {
    if (!currentSubject) {
      console.error("No subject selected");
      return;
    }

    try {
      // Combine the form data with the subject ID here
      const topicData = {
        ...formData,
        parent_subject: currentSubject.id
      };

      const res = await fetch("/api/topic_complex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topicData),
      });

      if (!res.ok) {
        throw new Error("Failed to add topic");
      }

      const newTopic = await res.json();
      console.log("Topic added:", newTopic);
      refreshTopics();
      setIsAddOpen(false);
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

  const handleEditTopic = async (formData: any) => {
    if (!currentThemenkomplex) {
      console.error("No topic selected for editing");
      return;
    }

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

      if (!res.ok) {
        throw new Error("Failed to update topic");
      }

      console.log("Topic updated:", currentThemenkomplex.id);
      refreshTopics();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating topic:", error);
    }
  };



  // const handleEditTopic = async (topicData: any) => {
  //   try {
  //     const res = await fetch(`/api/topic_complex/${topicData.id}`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(topicData),
  //     });

  //     if (!res.ok) {
  //       throw new Error("Failed to update topic");
  //     }

  //     console.log("Topic updated:", topicData.id);
  //     refreshTopics();
  //     setIsEditOpen(false);
  //   } catch (error) {
  //     console.error("Error updating topic:", error);
  //   }
  // };

  const handleDeleteTopic = async () => {
    try {
      setLoading(true);
      if (currentThemenkomplex) {
        const res = await fetch(`/api/topic_complex/${currentThemenkomplex.id}`, {
          method: "DELETE",
        });
        
        if (!res.ok) {
          throw new Error("Failed to delete topic");
        }
        
        console.log("Deleted topic:", currentThemenkomplex.id);
        setCurrentThemenkomplex(null);
        refreshTopics();
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
    } finally {
      setLoading(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {slug ? (
        <Breadcrumb items={[{ name: fachbereichName, href: `/fachbereich/${slug}` }]} />
      ) : (
        <p>Loading...</p>
      )}

      <div className="flex justify-between items-center my-8">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">Topics</h1>
          <h2 className="text-2xl font-semibold">{fachbereichName}</h2>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Themenkomplex
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading ? (
        // Skeleton Loading
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
          <p>No topics found.</p>
      )}
      </div>

      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add New Themenkomplex</SheetTitle>
            <SheetDescription>Enter the details for the new Themenkomplex.</SheetDescription>
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
            <SheetTitle>Edit Themenkomplex</SheetTitle>
            <SheetDescription>Modify the details of the Themenkomplex.</SheetDescription>
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
            <DialogTitle>Are you sure you want to delete the Themenkomplex {currentThemenkomplex?.name} ?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the Themenkomplex and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTopic} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

