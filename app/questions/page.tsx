"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Breadcrumb } from "@/components/Breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import { createClient } from '@/utils/supabase/client'
import { FeatureWrapper } from "@/components/FeatureWrapper"

interface Question {
  id: number
  question: string
  answer: string
  topics: string[]
  difficulty: "easy" | "medium" | "hard" | "expert"
}

const initialQuestions: Question[] = [
  {
    id: 1,
    question: "What is a variable in C#?",
    answer: "A variable in C# is a container for storing data values. It has a name, a type, and a value.",
    topics: ["C#"],
    difficulty: "easy",
  },
  {
    id: 2,
    question: "Explain the concept of inheritance in C#.",
    answer:
      "Inheritance is a mechanism in C# that allows a class to inherit properties and methods from another class. It promotes code reuse and establishes a relationship between a base class and one or more derived classes.",
    topics: ["C#"],
    difficulty: "medium",
  },
  {
    id: 3,
    question: "What is a primary key in SQL?",
    answer:
      "A primary key is a column or set of columns in a table that uniquely identifies each row in that table. It must contain unique values and cannot contain null values.",
    topics: ["SQL"],
    difficulty: "easy",
  },
  {
    id: 4,
    question: "Explain the difference between GET and POST methods in PHP.",
    answer:
      "GET sends data as part of the URL, while POST sends data in the request body. GET is less secure and has size limitations, while POST can handle larger amounts of data and is more secure for sensitive information.",
    topics: ["PHP"],
    difficulty: "medium",
  },
  {
    id: 5,
    question: "What is a closure in JavaScript?",
    answer:
      "A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned. It allows for data privacy and the creation of function factories.",
    topics: ["JavaScript"],
    difficulty: "hard",
  },
  {
    id: 6,
    question: "Explain the concept of state in React.",
    answer:
      "State in React is an object that holds data that may change over time. When state is updated, React re-renders the component to reflect the new state. It's used to make components interactive and dynamic.",
    topics: ["React"],
    difficulty: "medium",
  },
]

export default function QuestionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const apprenticeId = searchParams.get("apprenticeId")

  const supabase = createClient();

  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [questionsDb, setQuestionsDb] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [newQuestion, setNewQuestion] = useState<Omit<Question, "id">>({
    question: "",
    answer: "",
    topics: [],
    difficulty: "easy",
  })

  const getQuestions = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('question')
        .select(`
          *,
          difficulty (*),
          topic_complex (
            *,
            subject_area (*)
          )
        `)

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        console.log(data);
        setQuestionsDb(data)
      }
    } catch (error) {
      // alert('Error loading user data!')
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const checkAuthStatus = async () => {
    const res = await fetch('/api/questions');
    console.log("fetch", res.json());
  };

  useEffect(() => {
    getQuestions()
    checkAuthStatus()
  }, [getQuestions])

  const topics = Array.from(new Set(questions.flatMap((q) => q.topics)))

  const filteredQuestions = questions.filter(
    (q) =>
      (searchTerm === "" || q.question.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedTopic === null || q.topics.includes(selectedTopic)),
  )

  const addQuestionToApprentice = (questionId: number) => {
    // In a real application, this would make an API call to add the question to the apprentice
    console.log(`Adding question ${questionId} to apprentice ${apprenticeId}`)
    router.push(`/apprentices/${apprenticeId}`)
  }

  const handleAdd = () => {
    const id = Math.max(...questions.map((q) => q.id)) + 1
    setQuestions([...questions, { id, ...newQuestion }])
    setNewQuestion({ question: "", answer: "", topics: [], difficulty: "easy" })
    setIsAddOpen(false)
  }

  const handleEdit = () => {
    if (currentQuestion) {
      setQuestions(questions.map((q) => (q.id === currentQuestion.id ? currentQuestion : q)))
      setIsEditOpen(false)
    }
  }

  const handleDelete = () => {
    if (currentQuestion) {
      setQuestions(questions.filter((q) => q.id !== currentQuestion.id))
      setIsDeleteOpen(false)
    }
  }

  return (
    <FeatureWrapper
                  featureKey="question"
                  title="Manage Site"
                  description="Here you'll be able to manage everything!"
                >
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ name: "Questions", href: "/questions" }]} />

        <div className="flex justify-between items-center my-8">
          <h1 className="text-4xl font-bold">Browse Questions</h1>
          <Button onClick={() => setIsAddOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </div>

        <div className="mb-8 flex gap-4">
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <select
            value={selectedTopic || ""}
            onChange={(e) => setSelectedTopic(e.target.value || null)}
            className="border rounded p-2"
          >
            <option value="">All Topics</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          { loading ? (
            <p>Loading...</p>
          ) : questionsDb.length === 0 ? (
            <p>No questions found.</p>
          ) : filteredQuestions.map((question) => (
            <Card key={question.id} className="relative">
              <CardHeader>
                <CardTitle className="text-lg pr-20">{question.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{question.answer}</p>
                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    {question.topics.map((topic) => (
                      <Badge key={topic}>{topic}</Badge>
                    ))}
                    <Badge variant="outline">{question.difficulty}</Badge>
                  </div>
                  <div className="space-x-2">
                    {apprenticeId && (
                      <Button onClick={() => addQuestionToApprentice(question.id)}>Add to Apprentice</Button>
                    )}
                  </div>
                </div>
              </CardContent>
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setCurrentQuestion(question)
                    setIsEditOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setCurrentQuestion(question)
                    setIsDeleteOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Question</SheetTitle>
              <SheetDescription>Enter the details for the new question.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question" className="text-right">
                  Question
                </Label>
                <Textarea
                  id="question"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="answer" className="text-right">
                  Answer
                </Label>
                <Textarea
                  id="answer"
                  value={newQuestion.answer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="topics" className="text-right">
                  Topics
                </Label>
                <Input
                  id="topics"
                  value={newQuestion.topics.join(", ")}
                  onChange={(e) => setNewQuestion({ ...newQuestion, topics: e.target.value.split(", ") })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="difficulty" className="text-right">
                  Difficulty
                </Label>
                <select
                  id="difficulty"
                  value={newQuestion.difficulty}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, difficulty: e.target.value as Question["difficulty"] })
                  }
                  className="col-span-3 border rounded p-2"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" onClick={handleAdd}>
                  Save
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Question</SheetTitle>
              <SheetDescription>Modify the details of the question.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-question" className="text-right">
                  Question
                </Label>
                <Textarea
                  id="edit-question"
                  value={currentQuestion?.question}
                  onChange={(e) => setCurrentQuestion((curr) => (curr ? { ...curr, question: e.target.value } : null))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-answer" className="text-right">
                  Answer
                </Label>
                <Textarea
                  id="edit-answer"
                  value={currentQuestion?.answer}
                  onChange={(e) => setCurrentQuestion((curr) => (curr ? { ...curr, answer: e.target.value } : null))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-topics" className="text-right">
                  Topics
                </Label>
                <Input
                  id="edit-topics"
                  value={currentQuestion?.topics.join(", ")}
                  onChange={(e) =>
                    setCurrentQuestion((curr) => (curr ? { ...curr, topics: e.target.value.split(", ") } : null))
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-difficulty" className="text-right">
                  Difficulty
                </Label>
                <select
                  id="edit-difficulty"
                  value={currentQuestion?.difficulty}
                  onChange={(e) =>
                    setCurrentQuestion((curr) =>
                      curr ? { ...curr, difficulty: e.target.value as Question["difficulty"] } : null,
                    )
                  }
                  className="col-span-3 border rounded p-2"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" onClick={handleEdit}>
                  Save Changes
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete this question?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the question.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FeatureWrapper>
  )
}

