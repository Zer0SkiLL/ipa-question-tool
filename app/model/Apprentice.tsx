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

export interface ApprenticeDb {
  id: number,
  belongs_to: string,
  first_name: string,
  last_name: string,
  question: ApprenticeQuestion[],
  external_url: string,
  topics: string[],
  is_active: boolean,
  adress_link: string,
  project_title: string,
  project_short_description: string,
  expert_role: "Hauptexperte" | "Nebenexperte",
}

export interface ApprenticeOverviewForm {
  firstName: string;
  lastName: string;
  workLocation: string;
  projectTitle: string;
  projectDescription: string;
  expertRole: "Hauptexperte" | "Nebenexperte";
  projectTopics: string[];
  isActive?: boolean;
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
