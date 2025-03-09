'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink, Edit } from "lucide-react";
import { useState } from "react";

interface Apprentice {
  id: number;
  firstName: string;
  lastName: string;
  workLocation: string;
  projectTitle: string;
  projectDescription: string;
  expertRole: "Hauptexperte" | "Nebenexperte";
}

interface ApprenticeInfoProps {
  apprentice: Apprentice;
}

export function ApprenticeInfo({ apprentice }: ApprenticeInfoProps) {
  const getGoogleMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)

  return (
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
      <Button onClick={() => setIsEditFormOpen(true)} className="mt-4">
        <Edit className="w-4 h-4 mr-2" />
        Edit Apprentice
      </Button>

      {/* <ApprenticeForm
          apprentice={apprentice}
          isOpen={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          onSubmit={handleEditSubmit}
        /> */}
    </div>
  );
}