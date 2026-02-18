"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, Edit, PlusCircle, Trash2, UserPlus, X } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/Breadcrumb"
import { Question } from "../../../model/Question"
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
import AddQuestionForm from "@/components/AddQuestionOverlay"
import EditQuestionForm from "@/components/EditQuestionForm"
import { ApprenticeSelector } from "@/components/ApprenticeSelector"
import { toast } from "sonner"
import { useDemoMode } from "@/components/DemoModeProvider"



export default function ThemenkomplexPage({ params }: { params: Promise<{ slug: string; themenkomplex: string }> }) {
  const isDemoMode = useDemoMode()
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([])
  const [isApprenticeSelectorOpen, setIsApprenticeSelectorOpen] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [subjectSlug, setSubjectSlug] = useState<string | null>(null)
  const [topicSlug, setTopicSlug] = useState<string | null>(null)
  const [topicId, setTopicId] = useState<string | null>(null)
  const [fachbereichName, setFachbereichName] = useState<string>("")
  const [themenkomplexName, setThemenkomplexName] = useState<string>("")
  const [loading, setLoading] = useState(false);
  const [assignedApprentices, setAssignedApprentices] = useState<number[]>([])


useEffect(() => {
  if (!isApprenticeSelectorOpen) return

  const fetchAssignedApprentices = async () => {
    try {
      const response = await fetch(`/api/assigned-apprentices/${currentQuestion?.id}`)
      if (!response.ok) throw new Error("Failed to fetch assigned apprentices")
      const data = await response.json()
      if (data) {
        const apprenticeIds = data.map((apprentice: any) => apprentice.apprentice_id) // Extract apprentice IDs
        setAssignedApprentices(apprenticeIds) // Store assigned apprentice IDs
      }
    } catch (error) {
      console.error("Error fetching assigned apprentices:", error)
    }
  }

  fetchAssignedApprentices()
}, [isApprenticeSelectorOpen, currentQuestion?.id])

  // init param
  useEffect(() => {
    async function fetchParams() {
      const { slug, themenkomplex } = await params;
      if (slug) {
        setSubjectSlug(slug);
        setFachbereichName(
          slug
            .replace(/-/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        )
      }
      if (themenkomplex) {
        setTopicSlug(themenkomplex); 
        setThemenkomplexName(
          themenkomplex
            .replace(/-/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        )
      }
    }
    fetchParams();
  }, [params]);

  // get questions by topic
  useEffect(() => {
    if (!topicSlug) return;

    setLoading(true);

    const getQuestionByTopic = async () => {
      try {
        const res = await fetch(`/api/question/topic/${topicSlug}`);
        const data = await res.json();
        setQuestions(data.questions);
        setTopicId(data.topicId);
      } catch (error) {
        console.error("Error fetching questions by topic:", error);
      } finally {
        setLoading(false);
      }
    };

    getQuestionByTopic();
  }, [topicSlug]);

  // once questions are fetched, fetch the subject and topic
  useEffect(() => {

    if (!subjectSlug || !topicSlug) return;

    const getSubjectBySlug = async () => {
      try {
        const res = await fetch(`/api/subject_area/slug/${subjectSlug}`);
        const data = await res.json();
      } catch (error) {
        console.error("Error fetching subject:", error);
      }
    }

    const getTopicBySlug = async () => {
      try {
        const res = await fetch(`/api/topic_complex/slug/${topicSlug}`);
        const data = await res.json();
      } catch (error) {
        console.error("Error fetching topic:", error);
      }
    }

    getSubjectBySlug();
    getTopicBySlug();

  }, [questions, subjectSlug, topicSlug])

  const handleEditQuestion = async (data: { id: number; question: string; answer: string; difficulty: number; tags: string[] }) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/question/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...data, topic_id: topicId, difficulty_id: data.difficulty, tags: data.tags}),
      })
      if (!response.ok) throw new Error("Failed to update question")

      const updatedQuestion = await response.json()
      
      // Update the questions list with the edited question
      setQuestions(prev => prev.map(q => q.id === data.id ? {...q, answer: updatedQuestion.answer, question: updatedQuestion.question, difficulty: updatedQuestion.difficulty, tags: updatedQuestion.tags} : q))
      setIsEditOpen(false)
    } catch (error) {
      console.error("Error updating question:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestion = async (data: { question: string; answer: string; difficulty: number; tags: string[] }) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/question/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...data, 
          topic_id: topicId, 
          difficulty_id: data.difficulty, 
          tags: data.tags
        }),
      })

      if (!response.ok) throw new Error("Failed to add question")
      const newQuestion = await response.json()
          // Refresh your questions list
      setQuestions(prev => [...prev, newQuestion])
      setIsAddOpen(false)
    } catch (error) {
      console.error("Error adding question:", error)
    } finally {
      setLoading(false)
    } 
  }



  const handleDeleteQuestion = async () => {
    if (!currentQuestion) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/question/${currentQuestion.id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete question")
      
      // Remove the deleted question from the list
      setQuestions(prev => prev.filter(q => q.id !== currentQuestion.id))
      setIsDeleteOpen(false)
    } catch (error) {
      console.error("Error deleting question:", error)
    } finally {
      setLoading(false)
    }
  }

  

  const toggleQuestion = (id: number) => {
    setExpandedQuestions((prev) => (prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]))
  }

  const handleAddToApprentice = (question: Question) => {
    setCurrentQuestion(question)
    setIsApprenticeSelectorOpen(true)
  }

  const handleApprenticeSelect = async (apprenticeId: number) => {
    if (assignedApprentices.includes(apprenticeId)) return // Prevent duplicates
  
    setIsApprenticeSelectorOpen(false)
    
    // Assign the question to the apprentice
    try {
      await fetch("/api/assigned-apprentices/" + currentQuestion?.id, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apprenticeId }),
      })
      
      setAssignedApprentices((prev) => [...prev, apprenticeId]) // Update assigned list
      toast("Frage wurde dem Lernenden zugewiesen.")
    } catch (error) {
      console.error("Error assigning question:", error)
    } finally {
      setCurrentQuestion(null)
    }
  }

  const handleDeleteBadge = async (questionId: number, updatedTags: string[]) => {
    const response = await fetch(`/api/question/${questionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: updatedTags }),
    })
    if (!response.ok) {
      console.error("Failed to update question:", await response.text()); // Log error response
      throw new Error("Failed to update question");
    }

    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, tags: updatedTags } : q
      )
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: fachbereichName, href: `/fachbereich/${subjectSlug}` },
          { name: themenkomplexName, href: `/fachbereich/${subjectSlug}/${topicSlug}` },
        ]}
      />

      <div className="flex justify-between items-center my-8">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">Fragen</h1>
          <h2 className="text-2xl font-semibold">{fachbereichName} - {themenkomplexName}</h2>
        </div>
        {!isDemoMode && (
        <Button onClick={() => setIsAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Frage hinzufügen
        </Button>
        )}
      </div>

      <div className="space-y-4">
        { loading ? (
          // Skeleton Loading
          [...Array(3)].map((_, index) => (
            <div key={index} className="p-4 border rounded-lg animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : questions.length > 0 ? (
          questions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{question.question}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={`${question.difficulty.color} text-white`}>
                      {question.difficulty.name}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleAddToApprentice(question)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Lernende/m zuweisen
                    </Button>
                    {!isDemoMode && (
                    <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentQuestion(question)
                        setIsEditOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentQuestion(question)
                        setIsDeleteOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    </>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                {question.tags ? question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                      {!isDemoMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => {
                          const updatedTags = question.tags.filter((b) => b !== tag); // Compute new tags
                          handleDeleteBadge(question.id, updatedTags); // Pass directly
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      )}
                  </Badge>
                ) ) : null}
              </div>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between" onClick={() => toggleQuestion(question.id)}>
                  {expandedQuestions.includes(question.id) ? "Antwort verbergen" : "Antwort anzeigen"}
                  {expandedQuestions.includes(question.id) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                {expandedQuestions.includes(question.id) && (
                  <div className="mt-4 p-4 bg-muted rounded-md whitespace-pre-wrap">{question.answer}</div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-lg">Keine Fragen gefunden</div>
        )}
      </div>

      <ApprenticeSelector
        isOpen={isApprenticeSelectorOpen}
        onClose={() => setIsApprenticeSelectorOpen(false)}
        onSelect={handleApprenticeSelect}
        assignedApprentices={assignedApprentices}
      />

      {/* Add Question Sheet */}
      {!isDemoMode && (
      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Neue Frage hinzufügen</SheetTitle>
            <SheetDescription>Geben Sie die Details für die neue Frage ein.</SheetDescription>
          </SheetHeader>
          <AddQuestionForm
            onAdd={handleAddQuestion}
          />
        </SheetContent>
      </Sheet>
      )}

      {/* Edit Question Sheet */}
      {!isDemoMode && (
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Frage bearbeiten</SheetTitle>
            <SheetDescription>Bearbeiten Sie die Details der Frage.</SheetDescription>
          </SheetHeader>
          {currentQuestion && (
            <EditQuestionForm
              question={{
                id: currentQuestion.id,
                question: currentQuestion.question,
                answer: currentQuestion.answer,
                difficulty: currentQuestion.difficulty.id,
                tags: currentQuestion.tags
              }}
              
              
              onEdit={handleEditQuestion}
            />
          )}
        </SheetContent>
      </Sheet>
      )}

      {/* Delete Question Dialog */}
      {!isDemoMode && (
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Frage löschen &quot;{currentQuestion?.question}&quot;</DialogTitle>
            <DialogDescription>
              Möchten Sie diese Frage wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={loading}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuestion} disabled={loading}>
              {loading ? "Wird gelöscht..." : "Löschen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
    </div>

  )
}

