"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ApprenticeForm } from "@/components/ApprenticeForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Apprentice, ApprenticeDb, ApprenticeOverview, ApprenticeOverviewForm } from "../model/Apprentice"
import { FeatureWrapper } from "@/components/FeatureWrapper"

// interface Apprentice {
//   id: number
//   firstName: string
//   lastName: string
//   projectTitle: string
//   projectShortDescription: string
//   projectTopics: string[]
//   isActive: boolean
//   expertRole: string
// }

export default function ApprenticesPage() {
  const [isNewFormOpen, setIsNewFormOpen] = useState(false)
  const [loading, setLoading] = useState(true);
  const [apprentices, setApprentices] = useState<ApprenticeOverview[]>([
    // { id: 1, name: "John Doe", projectTitle: "E-Commerce Platform", projectTopics: ["C#", "SQL"], active: true },
    // { id: 2, name: "Jane Smith", projectTitle: "Mobile App", projectTopics: ["PHP", "JavaScript"], active: true },
    // {
    //   id: 3,
    //   name: "Alice Johnson",
    //   projectTitle: "Legacy System Migration",
    //   projectTopics: ["Java", "Oracle"],
    //   active: false,
    // },
  ])

  // useEffect(() => {
  //   const fetchApprentices = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch("/api/apprentice");
  //       const data = await response.json();
  //       console.log(data);
  //       setApprentices(data);
  //       console.log("Apprentices:", apprentices);
  //     } catch (error) {
  //       console.error("Error fetching apprentices:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchApprentices();
  // }, []);

  const mapApprenticesData = (data: ApprenticeDb[]): ApprenticeOverview[] => {
    return data.map((apprentice) => ({
      id: apprentice.id, // Assuming API doesn't return an ID, generate one
      firstName: apprentice.first_name,
      lastName: apprentice.last_name,
      projectTitle: apprentice.project_title,
      projectShortDescription: apprentice.project_short_description,
      projectTopics: apprentice.topics || [], // Ensure it's always an array
      isActive: apprentice.is_active,
      expertRole: apprentice.expert_role || "Unknown", // Handle null values
    }));
  };

  useEffect(() => {
    const fetchApprentices = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/apprentice");
        const data = await response.json();
        console.log("Raw API Response:", data);
  
        // Map API response to match the expected state structure
        const mappedData = mapApprenticesData(data);
  
        setApprentices(mappedData);
        console.log("Mapped Apprentices:", mappedData);
      } catch (error) {
        console.error("Error fetching apprentices:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchApprentices();
  }, []);
  

  const handleNewApprentice = async (newApprentice: Omit<ApprenticeOverviewForm, "id">) => {
    setLoading(true);
    try {
      const id = Math.max(...apprentices.map((a) => a.id)) + 1
      console.log(newApprentice)
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
      console.log("mapped appr", mappedApprentice)

      // post to api
      const response = await fetch("/api/apprentice", {
        method: "POST",
        body: JSON.stringify(mappedApprentice),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("API Response:", data);

      const newApprenticeApiResult = mapApprenticesData([data])[0]

      // update state
      setApprentices((prevApprentices) => [...prevApprentices, newApprenticeApiResult]);
    } catch (error) {
      console.error("Error creating apprentice:", error);
    } finally {
      setLoading(false);
    }
    // setApprentices([...apprentices, { ...newApprentice, id }])
    setIsNewFormOpen(false)
  }

  // const renderApprenticeCards = (activeStatus: boolean) => (
  //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //     { loading ? (
  //         // Skeleton Loading
  //         [...Array(3)].map((_, index) => (
  //           <div key={index} className="p-4 border rounded-lg animate-pulse">
  //             <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
  //             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  //           </div>
  //         ))
  //       ) : apprentices.length > 0 ? (
  //       apprentices
  //         .filter((a) => a.isActive === activeStatus)
  //         .map((apprentice) => (
  //           <Card key={apprentice.id} className="hover:bg-accent transition-colors">
  //             <Link href={`/apprentices/${apprentice.id}`} className="block p-6">
  //               <CardHeader>
  //                 <CardTitle>{apprentice.firstName} {apprentice.lastName}</CardTitle>
  //                 <CardDescription>
  //                   <div>Project: {apprentice.projectTitle}</div>
  //                   <div>Role: {apprentice.expertRole}</div>
  //                   <div>Description: {apprentice.projectShortDescription}</div>
  //                   <div>Topics: {apprentice.projectTopics.join(", ")}</div>
  //                 </CardDescription>
  //               </CardHeader>
  //             </Link>
  //           </Card>
  //         ))
  //       ) : (
  //         <div className="text-center text-gray-500">No apprentices found.</div>
  //       )
  //     }
  //   </div>
  // )

  // return (
  //   <div className="container mx-auto px-4 py-8">
  //     <div className="flex justify-between items-center mb-8">
  //       <h1 className="text-4xl font-bold">Apprentices</h1>
  //       <Button onClick={() => setIsNewFormOpen(true)}>Add Apprentice</Button>
  //     </div>

  //     <Tabs defaultValue="active" className="mb-8">
  //       <TabsList>
  //         <TabsTrigger value="active">Active</TabsTrigger>
  //         <TabsTrigger value="inactive">Inactive</TabsTrigger>
  //       </TabsList>
  //       <TabsContent value="active">{renderApprenticeCards(true)}</TabsContent>
  //       <TabsContent value="inactive">{renderApprenticeCards(false)}</TabsContent>
  //     </Tabs>

  //     {/* <ApprenticeForm isOpen={isNewFormOpen} onClose={() => setIsNewFormOpen(false)} onSubmit={handleNewApprentice} /> */}
  //   </div>
  // )



  const renderApprenticeCards = (activeStatus: boolean) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      { loading || apprentices.length === 0 ? (
          // Skeleton Loading
          [...Array(3)].map((_, index) => (
            <div key={index} className="p-4 border rounded-lg animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : apprentices.length > 0 ? (
        apprentices
        .filter((a) => a.isActive === activeStatus)
        .map((apprentice) => (
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
        )
      )) : (
        <div className="text-center text-lg">No apprentice found</div>
      )}

    </div>
  )

  return (
    <FeatureWrapper
      featureKey="apprentice"
      title="Apprentice Site"
      description="Here you'll be able to save your apprentice!"
    >
    
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Apprentices</h1>
          <Button onClick={() => setIsNewFormOpen(true)}>Add Apprentice</Button>
        </div>

        <Tabs defaultValue="active" className="mb-8">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          <TabsContent value="active">{renderApprenticeCards(true)}</TabsContent>
          <TabsContent value="inactive">{renderApprenticeCards(false)}</TabsContent>
        </Tabs>

        <ApprenticeForm isOpen={isNewFormOpen} onClose={() => setIsNewFormOpen(false)} onSubmit={handleNewApprentice} />
      </div>
    </FeatureWrapper>
  )
}

