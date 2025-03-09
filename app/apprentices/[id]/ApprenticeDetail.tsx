'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Breadcrumb } from "@/components/Breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { FileDown, Save, MapPin, Edit, ExternalLink } from "lucide-react"
import "jspdf-autotable"
import PDFGenerator from "@/components/PDFGenerator"
import { FeatureWrapper } from "@/components/FeatureWrapper"
import { ApprenticeForm } from "@/components/ApprenticeForm"

interface Question {
  id: number
  question: string
  answer: string
  fachbereich: string
  themenkomplex: string
  comment: string
}

interface GroupedQuestions {
  [fachbereich: string]: {
    [themenkomplex: string]: Question[]
  }
}

const initialQuestions: Question[] = [
  {
    id: 1,
    question: "What is a variable in C#?",
    answer: "A variable in C# is a container for storing data values.",
    fachbereich: "C#",
    themenkomplex: "General",
    comment: "",
  },
  {
    id: 2,
    question: "Explain inheritance in C#",
    answer:
      "Inheritance is a mechanism where you can to derive a class from another class for a hierarchy of classes that share a set of attributes and methods.",
    fachbereich: "C#",
    themenkomplex: "General",
    comment: "",
  },
  {
    id: 3,
    question: "What is unit testing?",
    answer:
      "Unit testing is a software testing method by which individual units of source code are tested to determine whether they are fit for use.",
    fachbereich: "C#",
    themenkomplex: "Testing",
    comment: "",
  },
  {
    id: 4,
    question: "What is a primary key in SQL?",
    answer: "A primary key is a column or set of columns in a table that uniquely identifies each row in that table.",
    fachbereich: "SQL",
    themenkomplex: "Basic Queries",
    comment: "",
  },
  {
    id: 5,
    question: "Explain SQL JOIN",
    answer: "SQL JOIN is used to combine rows from two or more tables, based on a related column between them.",
    fachbereich: "SQL",
    themenkomplex: "Basic Queries",
    comment: "",
  },
]

export default function ApprenticeDetail({ id }: { id: string }) {
  const [apprentice, setApprentice] = useState({
    id: Number.parseInt(id),
    firstName: "John",
    lastName: "Doe",
    workLocation: "Berlin, Germany",
    projectTitle: "E-Commerce Platform Development",
    projectDescription: "Developing a scalable e-commerce platform using modern web technologies.",
    expertRole: "Hauptexperte" as "Hauptexperte" | "Nebenexperte",
    projectTopics: ["C#", "SQL"],
  })

  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [assignedQuestions, setAssignedQuestions] = useState<Question[]>(initialQuestions)
  const [newTopic, setNewTopic] = useState("")
  const [saveStatus, setSaveStatus] = useState<Record<number, "saved" | "saving" | "error">>({})

  const addTopic = () => {
    if (newTopic && !apprentice.projectTopics.includes(newTopic)) {
      setApprentice({
        ...apprentice,
        projectTopics: [...apprentice.projectTopics, newTopic],
      })
      setNewTopic("")
    }
  }

  const updateComment = (questionId: number, comment: string) => {
    setAssignedQuestions(assignedQuestions.map((q) => (q.id === questionId ? { ...q, comment } : q)))
    setSaveStatus((prev) => ({ ...prev, [questionId]: "saving" }))
  }

  useEffect(() => {
    const saveComments = async () => {
      for (const questionId of Object.keys(saveStatus)) {
        if (saveStatus[Number(questionId)] === "saving") {
          try {
            // Simulating an API call
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setSaveStatus((prev) => ({ ...prev, [questionId]: "saved" }))
          } catch (error) {
            console.error("Error saving comment:", error)
            setSaveStatus((prev) => ({ ...prev, [questionId]: "error" }))
          }
        }
      }
    }

    saveComments()
  }, [saveStatus])

  const groupQuestions = (questions: Question[]): GroupedQuestions => {
    return questions.reduce((acc, question) => {
      if (!acc[question.fachbereich]) {
        acc[question.fachbereich] = {}
      }
      if (!acc[question.fachbereich][question.themenkomplex]) {
        acc[question.fachbereich][question.themenkomplex] = []
      }
      acc[question.fachbereich][question.themenkomplex].push(question)
      return acc
    }, {} as GroupedQuestions)
  }

  const groupedQuestions = groupQuestions(assignedQuestions)

  const uniqueThemenkomplexe = new Set(assignedQuestions.map((q) => q.themenkomplex))
  const themenkomplexCount = uniqueThemenkomplexe.size
  const themenkomplexProgress = (themenkomplexCount / 4) * 100

  const handleEditSubmit = (updatedApprentice: typeof apprentice) => {
    setApprentice(updatedApprentice)
    setIsEditFormOpen(false)
    // In a real application, you would also send this data to your backend
  }

  const getGoogleMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
  }

  return (
    <FeatureWrapper
          featureKey="apprentice-detail"
          title="Apprentice Site"
          description="Here you'll be able to save your apprentice!"
        >
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { name: "Apprentices", href: "/apprentices" },
            { name: apprentice.firstName + " " + apprentice.lastName, href: `/apprentices/${apprentice.id}` },
          ]}
        />

        <div className="flex justify-between items-center my-8">
          <h1 className="text-4xl font-bold">{apprentice.firstName} {apprentice.lastName}</h1>
          <Button onClick={() => setIsEditFormOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Apprentice
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Apprentice Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{apprentice.workLocation}</span>
                </div>
                <div>
                  <strong>Project Title:</strong> {apprentice.projectTitle}
                </div>
                <div>
                  <strong>Project Description:</strong> {apprentice.projectDescription}
                </div>
                <div>
                  <strong>Your Role:</strong> {apprentice.expertRole}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Work Location</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <a href={getGoogleMapsUrl(apprentice.workLocation)} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Google Maps
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Project Topics</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {apprentice.projectTopics.map((topic) => (
              <Badge key={topic}>{topic}</Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add new topic"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
            />
            <Button onClick={addTopic}>Add Topic</Button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Themenkomplex Overview</h2>
          <div className="flex justify-between items-center mb-2">
            <span>Total Themenkomplexe: {themenkomplexCount} / 4</span>
            <span className="text-sm text-muted-foreground">{themenkomplexProgress.toFixed(0)}% Complete</span>
          </div>
          <Progress value={themenkomplexProgress} className="mb-4" />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Assigned Questions</h2>
          {Object.entries(groupedQuestions).map(([fachbereich, themenkomplexe]) => (
            <div key={fachbereich} className="mb-6">
              <h3 className="text-xl font-semibold mb-4">{fachbereich}</h3>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(themenkomplexe).map(([themenkomplex, questions]) => {
                  const questionCount = questions.length
                  const questionProgress = (questionCount / 5) * 100

                  return (
                    <AccordionItem value={`${fachbereich}-${themenkomplex}`} key={themenkomplex}>
                      <div className="flex items-center justify-between">
                        <AccordionTrigger className="flex-grow">
                          <span>{themenkomplex}</span>
                        </AccordionTrigger>
                        <div className="flex items-center gap-4 px-4">
                          <span className="text-sm text-muted-foreground">Questions: {questionCount} / 5</span>
        
                                <PDFGenerator fachbereich={fachbereich} themenkomplex={themenkomplex} questions={questions}/>
                                {/* <FileDown className="w-4 h-4 mr-2" /> */}
                        </div>
                      </div>
                      <AccordionContent>
                        <Progress value={questionProgress} className="mb-4" />
                        <div className="space-y-4">
                          {questions.map((question) => (
                            <Card key={question.id}>
                              <CardHeader>
                                <CardTitle className="text-lg">{question.question}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="mb-4">{question.answer}</p>
                                <div className="relative">
                                  <Textarea
                                    placeholder="Add a comment about the apprentice's answer"
                                    value={question.comment}
                                    onChange={(e) => updateComment(question.id, e.target.value)}
                                    className="mb-4 pr-10"
                                  />
                                  <div className="absolute right-2 top-2">
                                    {saveStatus[question.id] === "saving" && (
                                      // <>Saving...<Save className="w-4 h-4 text-yellow-500 animate-pulse" /></>
                                      <>Saving...</>
                                    )}
                                    {saveStatus[question.id] === "saved" && <Save className="w-4 h-4 text-green-500" />}
                                    {saveStatus[question.id] === "error" && <Save className="w-4 h-4 text-red-500" />}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button asChild>
            <Link href={`/questions?apprenticeId=${apprentice.id}`}>Browse All Questions</Link>
          </Button>
        </div>

        {/* <ApprenticeForm
          apprentice={apprentice}
          isOpen={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          onSubmit={handleEditSubmit}
        /> */}
      </div>
    </FeatureWrapper>
  )
}
