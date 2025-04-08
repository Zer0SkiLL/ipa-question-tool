"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, Edit, PlusCircle, Trash2, UserPlus, X } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/Breadcrumb"
// import { Fachbereich } from "@/app/model/Fachbereich"
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
// import { Themenkomplex } from "@/app/model/Themenkomplex"



export default function ThemenkomplexPage({ params }: { params: Promise<{ slug: string; themenkomplex: string }> }) {
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
  // const [currentSubject, setCurrentSubject] = useState<Fachbereich | null>(null)
  const [loading, setLoading] = useState(false);
  const [assignedApprentices, setAssignedApprentices] = useState<number[]>([])


useEffect(() => {
  if (!isApprenticeSelectorOpen) return

  const fetchAssignedApprentices = async () => {
    try {
      const response = await fetch(`/api/assigned-apprentices/${currentQuestion?.id}`)
      if (!response.ok) throw new Error("Failed to fetch assigned apprentices")
      const data = await response.json()
      console.log("assigned apprentice fetched", data)
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
      console.log("fetchParams")
      const { slug, themenkomplex } = await params;
      console.log("slug", slug)
      console.log("topicSlugParam", themenkomplex)
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
    console.log("fetch questions by topic", topicSlug)
    if (!topicSlug) return;

    setLoading(true);

    const getQuestionByTopic = async () => {
      try {
        const res = await fetch(`/api/question/topic/${topicSlug}`);
        const data = await res.json();
        console.log("fetch questions by topic", data);
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

    console.log("fetch subject and topic", subjectSlug, topicSlug)

    if (!subjectSlug || !topicSlug) return;

    const getSubjectBySlug = async () => {
      try {
        const res = await fetch(`/api/subject_area/slug/${subjectSlug}`);
        const data = await res.json();
        // setSubject(data);
        console.log("fetch subjects by slug", data);
      } catch (error) {
        console.error("Error fetching subject:", error);
      }
    }

    const getTopicBySlug = async () => {
      try {
        const res = await fetch(`/api/topic_complex/slug/${topicSlug}`);
        const data = await res.json();
        // setTopic(data);
        console.log("fetch topics by slug", data);
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
      console.log("data in handleEditQuestion", data);
      // Ensure data.tags is a string before calling split
      console.log("tags", data.tags)

      const response = await fetch(`/api/question/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...data, topic_id: topicId, difficulty_id: data.difficulty, tags: data.tags}),
      })
      if (!response.ok) throw new Error("Failed to update question")

      console.log("result", response)

      const updatedQuestion = await response.json()
      console.log("updated question", updatedQuestion)
      
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
      console.log("data here:", data)
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

      console.log("result", response)
      
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
    console.log(`Adding question ${currentQuestion?.id} to apprentice ${apprenticeId}`)
  
    setIsApprenticeSelectorOpen(false)
    
    // Assign the question to the apprentice
    try {
      await fetch("/api/assigned-apprentices/" + currentQuestion?.id, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apprenticeId }),
      })
      
      setAssignedApprentices((prev) => [...prev, apprenticeId]) // Update assigned list
      toast("Question has been assigned to apprentice.")
    } catch (error) {
      console.error("Error assigning question:", error)
    } finally {
      setCurrentQuestion(null)
    }
  }

  // const handleApprenticeSelect = (apprenticeId: number) => {
  //   console.log(`Adding question ${currentQuestion?.id} to apprentice ${apprenticeId}`)
  //   setIsApprenticeSelectorOpen(false)
  //   setCurrentQuestion(null)
  // }

  const handleDeleteBadge = async (questionId: number, updatedTags: string[]) => {
    console.log("Updated tags to send:", updatedTags);
    console.log("currentQuestion", currentQuestion)
    console.log("questionId", questionId)
    // console.log("tag", tag)
    // const updatedTags = currentQuestion?.tags.filter((b) => b !== tag) || [];
    // console.log("Updated tags to send:", updatedTags); // Debugging log

    const response = await fetch(`/api/question/${questionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: updatedTags }),
    })
    if (!response.ok) {
      console.error("Failed to update question:", await response.text()); // Log error response
      throw new Error("Failed to update question");
    }

    // console.log("result", response)

    // const updatedQuestion = await response.json()
    console.log("updated questions tag")
    // setCurrentQuestion((prev) => prev ? { ...prev, tags: updatedTags } : null);

    console.log("updated question", currentQuestion)

    // ✅ Also update the list of questions
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
          <h1 className="text-4xl font-bold">Questions</h1>
          <h2 className="text-2xl font-semibold">{fachbereichName} - {themenkomplexName}</h2>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Question
        </Button>
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
              {/* <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{question.question}</CardTitle>
                  <Badge className={`${question.difficulty.color} text-white`}>{question.difficulty.name}</Badge>
                </div>
              </CardHeader> */}
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{question.question}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={`${question.difficulty.color} text-white`}>
                      {question.difficulty.name}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleAddToApprentice(question)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add to Apprentice
                    </Button>
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
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                {question.tags ? question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
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
                  </Badge>
                ) ) : null}
              </div>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between" onClick={() => toggleQuestion(question.id)}>
                  {expandedQuestions.includes(question.id) ? "Hide Answer" : "Show Answer"}
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
          <div className="text-center text-lg">No questions found</div>
        )}
      </div>

      <ApprenticeSelector
        isOpen={isApprenticeSelectorOpen}
        onClose={() => setIsApprenticeSelectorOpen(false)}
        onSelect={handleApprenticeSelect}
        assignedApprentices={assignedApprentices}
      />

      {/* Add Question Sheet */}
      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add New Question</SheetTitle>
            <SheetDescription>Enter the details for the new question.</SheetDescription>
          </SheetHeader>
          <AddQuestionForm
            onAdd={handleAddQuestion}
          />
        </SheetContent>
      </Sheet>

      {/* Edit Question Sheet */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Question</SheetTitle>
            <SheetDescription>Modify the details of the question.</SheetDescription>
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

      {/* Delete Question Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question &quot;{currentQuestion?.question}&quot;</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuestion} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

  )

  // function handleAddQuestion(): (data: { question: string; answer: string; difficulty: number }) => void {
  //   return async (data) => {
  //     try {
  //       console.log("data here:", data)
  //       const response = await fetch(`/api/question/`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ ...data, topic_id: topicId, difficulty_id: data.difficulty }),
  //       })
  //       if (!response.ok) throw new Error("Failed to add question")
  //       const newQuestion = await response.json()
  //       // Refresh your questions list
  //       setQuestions(prev => [...prev, newQuestion])
  //       setIsAddOpen(false)
  //     } catch (error) {
  //       console.error("Error adding question:", error)
  //     }
  //   }
  // }
}

