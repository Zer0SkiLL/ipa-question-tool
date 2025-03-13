'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileDown, Save } from "lucide-react";
import PDFGenerator from "@/components/PDFGenerator";
import { useState } from "react";

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

interface AssignedQuestionsProps {
  groupedQuestions: Record<string, Record<string, Question[]>>;
}

export function AssignedQuestions({ groupedQuestions }: AssignedQuestionsProps) {
    const [assignedQuestions, setAssignedQuestions] = useState<Question[]>([]);
    const [saveStatus, setSaveStatus] = useState<Record<number, "saved" | "saving" | "error">>({});


    const updateComment = (questionId: number, comment: string) => {
        setAssignedQuestions(assignedQuestions.map((q) => (q.id === questionId ? { ...q, comment } : q)))
        setSaveStatus((prev) => ({ ...prev, [questionId]: "saving" }))
    }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Assigned Questions</h2>
      {Object.entries(groupedQuestions).map(([fachbereich, themenkomplexe]) => (
        <div key={fachbereich} className="mb-6">
          <h3 className="text-xl font-semibold mb-4">{fachbereich}</h3>
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(themenkomplexe).map(([themenkomplex, questions]) => {
              const questionCount = questions.length;
              const questionProgress = (questionCount / 5) * 100;

              return (
                <AccordionItem value={`${fachbereich}-${themenkomplex}`} key={themenkomplex}>
                  <div className="flex items-center justify-between">
                    <AccordionTrigger className="flex-grow">
                      <span>{themenkomplex}</span>
                    </AccordionTrigger>
                    <div className="flex items-center gap-4 px-4">
                      <span className="text-sm text-muted-foreground">Questions: {questionCount} / 5</span>
                      <Button variant="outline" size="sm">
                        <PDFGenerator fachbereich={fachbereich} themenkomplex={themenkomplex} questions={questions} />
                        <FileDown className="w-4 h-4 mr-2" />
                      </Button>
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
                            <Textarea
                              placeholder="Add a comment about the apprentice's answer"
                              value={question.comment}
                              onChange={(e) => updateComment(question.id, e.target.value)}
                              className="mb-4"
                            />
                            {saveStatus[question.id] === "saving" && <>Saving...</>}
                            {saveStatus[question.id] === "saved" && <Save className="w-4 h-4 text-green-500" />}
                            {saveStatus[question.id] === "error" && <Save className="w-4 h-4 text-red-500" />}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      ))}
    </div>
  );
}
