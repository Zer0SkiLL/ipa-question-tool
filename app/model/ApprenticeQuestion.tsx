'use client';

import { Question } from "./Question";

export interface ApprenticeQuestion {
    id: number;
    questions: Question;
    answers: string;
}