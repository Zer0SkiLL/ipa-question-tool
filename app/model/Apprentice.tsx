"use client";

import { ApprenticeQuestion } from "./ApprenticeQuestion";

export interface Apprentice {
  firstName: string;
  lastName: string;
  workLocation: string;
  projectTitle: string;
  projectDescription: string;
  expertRole: "Hauptexperte" | "Nebenexperte";
  projectTopics: string[];
  isActive: boolean;
}

export interface ApprenticeOverviewForm {
  firstName: string;
  lastName: string;
  workLocation?: string;
  projectTitle?: string;
  projectDescription?: string;
  expertRole: "Hauptexperte" | "Nebenexperte";
  projectTopics?: string[];
}

export interface ApprenticeOverview {
  id: number
  firstName: string
  lastName: string
  projectTitle: string
  projectShortDescription: string
  projectTopics: string[]
  isActive: boolean
  expertRole: string
}

export interface ApprenticeDetails {
  id: number
  firstName: string
  lastName: string
  workLocation: string
  projectTitle: string
  projectDescription: string
  expertRole: string
  projectTopics: string[],
  questions: ApprenticeQuestion[]
}
