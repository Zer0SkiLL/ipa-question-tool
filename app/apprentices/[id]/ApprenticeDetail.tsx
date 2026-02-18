'use client'

import { useState, useEffect, useCallback } from "react"
import { Breadcrumb } from "@/components/Breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { FileDown, Save, MapPin, Edit, ExternalLink, Trash2 } from "lucide-react"
import "jspdf-autotable"
import PDFGenerator from "@/components/PDFGenerator"
import ApprenticePDFGenerator from "@/components/ApprenticePDFGenerator"
import { FeatureWrapper } from "@/components/FeatureWrapper"
import { ApprenticeForm } from "@/components/ApprenticeForm"
import { Themenkomplex } from "@/app/model/Themenkomplex"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { debounce } from "lodash";
import { useDemoMode } from "@/components/DemoModeProvider"


interface Question {
  id: number
  question: string
  answer: string
  fachbereich: string
  themenkomplex: string
  comment: string
  score: number | null
  isAsked: boolean
  difficulty: {
    name: string
    color: string
  }
}

interface GroupedQuestions {
  [fachbereich: string]: {
    [themenkomplex: string]: Question[]
  }
}

export default function ApprenticeDetail({ id }: { id: string }) {
  const isDemoMode = useDemoMode()
  const [apprentice, setApprentice] = useState({
    id: Number.parseInt(id),
    first_name: "John",
    last_name: "Doe",
    address_link: "Berlin, Germany",
    project_title: "E-Commerce Platform Development",
    project_short_description: "Developing a scalable e-commerce platform using modern web technologies.",
    expert_role: "Hauptexperte" as "Hauptexperte" | "Nebenexperte",
    topics: ["C#", "SQL"],
  })

  const [textInputs, setTextInputs] = useState<{ [key: number]: string }>({});
  const [scoreInputs, setScoreInputs] = useState<{ [key: number]: number | null }>({});
  const [isAskedInputs, setIsAskedInputs] = useState<{ [key: number]: boolean }>({});
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [newTopic, setNewTopic] = useState("")
  const [saveStatus, setSaveStatus] = useState<Record<number, "saved" | "saving" | "error">>({})
  const [isLoading, setIsLoading] = useState(true)
  const [questions, setQuestions] = useState<any[]>([])
  const [groupedQuestions, setGroupedQuestions] = useState<GroupedQuestions>({})
  const [themenkomplexProgress, setThemenkomplexProgress] = useState(0)
  const [themenkomplexCount, setThemenkomplexCount] = useState(0) 

  useEffect(() => {
    const fetchApprentice = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/apprentice/${id}`)
        const data = await response.json()
        setApprentice(data)
        setQuestions(data.apprentice_question)
        const mappedQuestions = mapQuestions(data.apprentice_question)
        const grouped = groupQuestions(mappedQuestions);
        const initialInputs = mappedQuestions.reduce((acc, q) => {
          acc[q.id] = q.comment || "";
          return acc;
        }, {} as { [key: number]: string });
      
        setTextInputs(initialInputs);

        const initialScores = mappedQuestions.reduce((acc, q) => {
          acc[q.id] = q.score;
          return acc;
        }, {} as { [key: number]: number | null });
        setScoreInputs(initialScores);

        const initialIsAsked = mappedQuestions.reduce((acc, q) => {
          acc[q.id] = q.isAsked;
          return acc;
        }, {} as { [key: number]: boolean });
        setIsAskedInputs(initialIsAsked);

        setGroupedQuestions(grouped); 
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching apprentice:", error)
        setIsLoading(false)
      }
    }

    fetchApprentice()
  }, [id])

  const mapQuestions = (questions: any[]) => {
    // we need to map the questions and also sort by difficulty.level asc
    const sortedQuestions = [...questions].sort((a, b) => a.question.difficulty.level - b.question.difficulty.level)
    return sortedQuestions.map((q) => ({
      id: q.question.id,
      question: q.question.question,
      answer: q.question.answer,
      fachbereich: q.question.topic_complex.parent_subject.name,
      themenkomplex: q.question.topic_complex.name,
      comment: q.comment,
      score: q.score ?? null,
      isAsked: q.is_asked ?? false,
      difficulty: q.question.difficulty
    }))
  }

  const [text, setText] = useState("");

  // Debounce the input handler
  const debouncedUpdateComment = useCallback(
    debounce((questionId: number, comment: string) => {
      updateComment(questionId, comment);
    }, 500), // 500ms debounce
    []
  );
  
  // Function to handle textarea changes
  const handleDebouncedChange = (questionId: number, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    setTextInputs((prev) => ({ ...prev, [questionId]: value }));

    // Set status to "saving" immediately when user types
    setSaveStatus((prev) => ({ ...prev, [questionId]: "saving" }));
    debouncedUpdateComment(questionId, value);
  };

  const updateComment = async (questionId: number, comment: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, comment } : q
      )
    );
  
    setSaveStatus((prev) => ({ ...prev, [questionId]: "saving" }));
  
    try {
      const response = await fetch(`/api/question/${questionId}/comment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment, apprenticeId: id }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save comment");
      }

      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === questionId ? { ...q, comment } : q
        )
      );
  
      setSaveStatus((prev) => ({ ...prev, [questionId]: "saved" }));
    } catch (error) {
      console.error("Error saving comment:", error);
      setSaveStatus((prev) => ({ ...prev, [questionId]: "error" }));
    }
  };

  const updateScore = async (questionId: number, score: number | null) => {
    setScoreInputs((prev) => ({ ...prev, [questionId]: score }));
    try {
      const response = await fetch(`/api/question/${questionId}/comment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, apprenticeId: id }),
      });
      if (!response.ok) throw new Error("Failed to save score");
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const updateIsAsked = async (questionId: number, isAsked: boolean) => {
    setIsAskedInputs((prev) => ({ ...prev, [questionId]: isAsked }));
    try {
      const response = await fetch(`/api/question/${questionId}/comment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAsked, apprenticeId: id }),
      });
      if (!response.ok) throw new Error("Failed to save is_asked");
    } catch (error) {
      console.error("Error saving is_asked:", error);
    }
  };
  

  const groupQuestions = (questions: Question[]): GroupedQuestions => {
    const grouped = questions.reduce((acc, question) => {
      if (!acc[question.fachbereich]) {
        acc[question.fachbereich] = {};
      }
      if (!acc[question.fachbereich][question.themenkomplex]) {
        acc[question.fachbereich][question.themenkomplex] = [];
      }
      acc[question.fachbereich][question.themenkomplex].push(question);
      return acc;
    }, {} as GroupedQuestions);
  
    // Get unique Themenkomplex count
    const uniqueThemenkomplexe = new Set(questions.map(q => q.themenkomplex));
    setThemenkomplexCount(uniqueThemenkomplexe.size);
    setThemenkomplexProgress((uniqueThemenkomplexe.size / 6) * 100); // Assuming 6 is max
  
    return grouped;
  };
  

  const handleEditSubmit = async (formData: import("@/app/model/Apprentice").ApprenticeOverviewForm) => {
    try {
      const response = await fetch(`/api/apprentice/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Failed to update apprentice")
      const updated = await response.json()
      setApprentice(updated)
      setIsEditFormOpen(false)
    } catch (error) {
      console.error("Error updating apprentice:", error)
    }
  }

  const unassignQuestion = async (questionId: number) => {
    try {
      const response = await fetch(`/api/assigned-apprentices/unassign/${questionId}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) throw new Error("Failed to unassign question");
  
      setQuestions((prevQuestions) => {
        const updatedQuestions = prevQuestions.filter((q) => q.question.id !== questionId)
        const newGroupedQuestions = { ...groupQuestions(mapQuestions(updatedQuestions)) }
        setGroupedQuestions(newGroupedQuestions)
        return updatedQuestions
      })
    } catch (error) {
      console.error("Error unassigning question:", error);
    }
  };

  const getGoogleMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
  }

  return (
    <FeatureWrapper
          featureKey="apprentice-detail"
          title="Lernende"
          description="Hier können Sie Ihre Lernenden verwalten!"
        >
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { name: "Lernende", href: "/apprentices" },
            { name: apprentice.first_name + " " + apprentice.last_name, href: `/apprentices/${apprentice.id}` },
          ]}
        />

        <div className="flex justify-between items-center my-8">
          <h1 className="text-4xl font-bold">{apprentice.first_name} {apprentice.last_name} <Badge
                    variant={apprentice.expert_role == "Hauptexperte" ? "destructive" : null}
                    className="ml-2"
                  >{apprentice.expert_role}</Badge></h1>
          {!isDemoMode && (
            <Button onClick={() => setIsEditFormOpen(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Lernende/r bearbeiten
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Informationen zum Lernenden</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{apprentice.address_link}</span>
                </div>
                <div>
                  <strong>Projekttitel:</strong> {apprentice.project_title}
                </div>
                <div>
                  <strong>Projektbeschreibung:</strong> {apprentice.project_short_description}
                </div>
                <div>
                  <strong>Ihre Rolle:</strong> {apprentice.expert_role}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Arbeitsort</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <a href={getGoogleMapsUrl(apprentice.address_link)} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  In Google Maps öffnen
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Themenkomplex Übersicht</h2>
          <div className="flex justify-between items-center mb-2">
            <span>Themenkomplexe gesamt: {themenkomplexCount} / 6</span>
            <span className="text-sm text-muted-foreground">{themenkomplexProgress.toFixed(0)}% Abgeschlossen</span>
          </div>
          <Progress value={themenkomplexProgress} className="mb-4" />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Zugewiesene Fragen</h2>
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
                          <span className="text-sm text-muted-foreground">Fragen: {questionCount} / 5</span>
                          <span className="text-sm text-muted-foreground">
                            Bewertung: {questions.reduce((sum, q) => sum + (scoreInputs[q.id] ?? 0), 0)} / {questions.length * 2} Punkte
                          </span>
        
                                <PDFGenerator fachbereich={fachbereich} themenkomplex={themenkomplex} questions={questions}/>
                                {/* <FileDown className="w-4 h-4 mr-2" /> */}
                        </div>
                      </div>
                      <AccordionContent>
                        <Progress value={questionProgress} className="mb-4" />
                        <div className="space-y-4">
                          {questions.map((question) => (
                            <Card key={question.id} className={isAskedInputs[question.id] ? "border-l-4 border-l-green-500" : ""}>
                              <CardHeader>
                                <CardTitle className="text-lg">{question.question}</CardTitle>
                                <div className="flex items-center gap-2">
                                  <Badge className={`${question.difficulty.color} text-white`}>
                                    {question.difficulty.name}
                                  </Badge>
                                  <label className="flex items-center gap-2 text-sm">
                                    <input
                                      type="checkbox"
                                      checked={isAskedInputs[question.id] ?? false}
                                      onChange={(e) => updateIsAsked(question.id, e.target.checked)}
                                      className="h-4 w-4 rounded border-gray-300"
                                    />
                                    Gefragt
                                  </label>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          className="ml-auto"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => unassignQuestion(question.id)}
                                        >
                                          <Trash2 className="w-5 h-5 text-red-500" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Frage entfernen</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="mb-4 whitespace-pre-wrap">{question.answer}</p>
                                <div className="flex items-center gap-4 mb-3">
                                  <span className="text-sm font-medium">Bewertung:</span>
                                  {[
                                    { value: null, label: "--" },
                                    { value: 0, label: "0 - Nicht beantwortet" },
                                    { value: 1, label: "1 - Teilweise korrekt" },
                                    { value: 2, label: "2 - Korrekt" },
                                  ].map((option) => (
                                    <label key={String(option.value)} className="flex items-center gap-1 text-sm">
                                      <input
                                        type="radio"
                                        name={`score-${question.id}`}
                                        checked={scoreInputs[question.id] === option.value}
                                        onChange={() => updateScore(question.id, option.value)}
                                        className="h-4 w-4"
                                      />
                                      {option.label}
                                    </label>
                                  ))}
                                </div>
                                <div className="relative">
                                  <Textarea
                                    placeholder="Kommentar zur Antwort des Lernenden"
                                    value={textInputs[question.id] ?? ""}
                                    onChange={(e) => handleDebouncedChange(question.id, e)}
                                    className="mb-4 pr-10"
                                  />
                                  <div className="absolute right-2 top-2">
                                    {saveStatus[question.id] === "saving" && <>Speichern...</>}
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

        <div className="mt-8 flex gap-4">
          <ApprenticePDFGenerator
            apprentice={apprentice}
            groupedQuestions={groupedQuestions}
            scoreInputs={scoreInputs}
            isAskedInputs={isAskedInputs}
            textInputs={textInputs}
          />
        </div>
      </div>

      {!isDemoMode && (
        <ApprenticeForm
          apprentice={{
            firstName: apprentice.first_name,
            lastName: apprentice.last_name,
            workLocation: apprentice.address_link || "",
            projectTitle: apprentice.project_title || "",
            projectDescription: apprentice.project_short_description || "",
            expertRole: apprentice.expert_role,
            projectTopics: apprentice.topics || [],
            isActive: (apprentice as any).is_active ?? true,
          }}
          isOpen={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          onSubmit={handleEditSubmit}
        />
      )}
    </FeatureWrapper>
  )
}
