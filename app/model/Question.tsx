"use client";
import { Difficulty } from "./Difficulty";

export interface Question {
  id: number
  question: string
  answer: string
  difficulty: Difficulty
  topic_id: number
  tags: string[]
}
