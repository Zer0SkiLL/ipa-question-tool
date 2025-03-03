"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import { FeatureWrapper } from "@/components/FeatureWrapper"

interface Item {
  id: string
  name: string
  description: string
  slug: string
}

const initialFachbereiche: Item[] = [
  { id: "1", name: "C#", description: "C# programming language", slug: "csharp" },
  { id: "2", name: "Testing", description: "Software testing methodologies", slug: "testing" },
  { id: "3", name: "SQL", description: "Database management and queries", slug: "sql" },
]

const initialThemenkomplexe: Item[] = [
  { id: "1", name: "General", description: "General C# concepts", slug: "general" },
  { id: "2", name: "Error Handling", description: "Error handling in C#", slug: "error-handling" },
  { id: "3", name: "Logging", description: "Logging in C# applications", slug: "logging" },
]

const initialQuestions: Item[] = [
  { id: "1", name: "What is a variable in C#?", description: "Easy", slug: "variable-csharp" },
  { id: "2", name: "Explain inheritance in C#", description: "Medium", slug: "inheritance-csharp" },
  { id: "3", name: "What is LINQ?", description: "Hard", slug: "linq-csharp" },
]

export default function ManagePage() {
  const [fachbereiche, setFachbereiche] = useState<Item[]>(initialFachbereiche)
  const [themenkomplexe, setThemenkomplexe] = useState<Item[]>(initialThemenkomplexe)
  const [questions, setQuestions] = useState<Item[]>(initialQuestions)

  const renderItems = (items: Item[], editLink: string) => (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end space-x-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`${editLink}/${item.id}`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <FeatureWrapper
              featureKey="manage"
              title="Manage Site"
              description="Here you'll be able to manage everything!"
            >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Manage Content</h1>

        <Tabs defaultValue="fachbereiche">
          <TabsList className="mb-4">
            <TabsTrigger value="fachbereiche">Fachbereiche</TabsTrigger>
            <TabsTrigger value="themenkomplexe">Themenkomplexe</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="fachbereiche">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Fachbereiche</h2>
              <Button asChild>
                <Link href="/fachbereich/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Fachbereich
                </Link>
              </Button>
            </div>
            {renderItems(fachbereiche, "/fachbereich")}
          </TabsContent>

          <TabsContent value="themenkomplexe">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Themenkomplexe</h2>
              <Button asChild>
                <Link href="/themenkomplex/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Themenkomplex
                </Link>
              </Button>
            </div>
            {renderItems(themenkomplexe, "/themenkomplex")}
          </TabsContent>

          <TabsContent value="questions">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Questions</h2>
              <Button asChild>
                <Link href="/questions/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Question
                </Link>
              </Button>
            </div>
            {renderItems(questions, "/questions")}
          </TabsContent>
        </Tabs>
      </div>
    </FeatureWrapper>
  )
}

