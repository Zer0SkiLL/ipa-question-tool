"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ApprenticeForm } from "@/components/ApprenticeForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Apprentice, ApprenticeOverviewForm } from "../model/Apprentice"
import { FeatureWrapper } from "@/components/FeatureWrapper"
import { useDemoMode } from "@/components/DemoModeProvider"
import { useApprentices } from "@/hooks/use-apprentices"

export default function ApprenticesPage() {
  const isDemoMode = useDemoMode()
  const [isNewFormOpen, setIsNewFormOpen] = useState(false)
  const { apprentices, isLoading: loading, mutate } = useApprentices()

  const handleNewApprentice = async (newApprentice: Omit<ApprenticeOverviewForm, "id">) => {
    try {
      const mappedApprentice: Apprentice = {
        firstName: newApprentice.firstName,
        lastName: newApprentice.lastName,
        expertRole: newApprentice.expertRole,
        projectTitle: newApprentice.projectTitle || "",
        projectDescription: newApprentice.projectDescription || "",
        projectTopics: newApprentice.projectTopics || [],
        workLocation: newApprentice.workLocation || "",
        isActive: true,
      }

      const response = await fetch("/api/apprentice", {
        method: "POST",
        body: JSON.stringify(mappedApprentice),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to create apprentice");

      mutate();
    } catch (error) {
      console.error("Error creating apprentice:", error);
    }
    setIsNewFormOpen(false)
  }

  const renderApprenticeCards = (activeStatus: boolean) => {
    const filtered = apprentices.filter((a) => a.isActive === activeStatus);

    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="p-4 border rounded-lg animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div className="text-center text-lg text-muted-foreground py-8">
          {activeStatus ? "Keine aktiven Lernenden gefunden" : "Keine inaktiven Lernenden gefunden"}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((apprentice) => (
          <Card key={apprentice.id} className="hover:bg-accent transition-colors relative">
            <Link href={`/apprentices/${apprentice.id}`} className="block p-6">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{apprentice.firstName} {apprentice.lastName}</CardTitle>
                  <Badge
                    variant={apprentice.expertRole == "Hauptexperte" ? "destructive" : null}
                    className="absolute top-2 right-2"
                  >
                    {apprentice.expertRole}
                  </Badge>
                </div>
                <CardDescription className="font-semibold">{apprentice.projectTitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm text-muted-foreground line-clamp-2">{apprentice.projectShortDescription}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{apprentice.projectShortDescription}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex flex-wrap gap-2 mt-2">
                  {apprentice.projectTopics.map((topic, index) => (
                    <Badge key={index} variant="outline">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <FeatureWrapper
      featureKey="apprentice"
      title="Lernende"
      description="Hier können Sie Ihre Lernenden verwalten!"
    >
    
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Lernende</h1>
          {!isDemoMode && (
          <Button onClick={() => setIsNewFormOpen(true)}>Lernende/r hinzufügen</Button>
          )}
        </div>

        <Tabs defaultValue="active" className="mb-8">
          <TabsList>
            <TabsTrigger value="active">Aktiv</TabsTrigger>
            <TabsTrigger value="inactive">Inaktiv</TabsTrigger>
          </TabsList>
          <TabsContent value="active">{renderApprenticeCards(true)}</TabsContent>
          <TabsContent value="inactive">{renderApprenticeCards(false)}</TabsContent>
        </Tabs>

        {!isDemoMode && (
        <ApprenticeForm isOpen={isNewFormOpen} onClose={() => setIsNewFormOpen(false)} onSubmit={handleNewApprentice} />
        )}
      </div>
    </FeatureWrapper>
  )
}
