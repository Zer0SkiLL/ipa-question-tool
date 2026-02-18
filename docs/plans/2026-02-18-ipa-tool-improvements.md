# IPA Question Tool Improvements - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add demo mode, fix bugs, add answer scoring, switch UI to German, generate new questions.

**Architecture:** Next.js 15 + Supabase (auth + DB). Demo mode via app-level checks on authenticated user email. Scoring via new DB columns on `apprentice_question`. All UI text in German.

**Tech Stack:** Next.js 15, React 19, Supabase, shadcn/ui, Tailwind CSS, jsPDF

---

## Task 1: Demo Mode Infrastructure

**Files:**
- Create: `utils/demo.ts`
- Create: `components/DemoModeProvider.tsx`
- Create: `components/DemoModeBanner.tsx`
- Modify: `app/layout.tsx`

### Step 1: Create demo utility

`utils/demo.ts`:
```ts
export const DEMO_USER_EMAIL = "demo@ipa.wid.li";

export function isDemoUser(email: string | undefined | null): boolean {
  return email === DEMO_USER_EMAIL;
}
```

### Step 2: Create DemoModeProvider context

`components/DemoModeProvider.tsx`:
```tsx
"use client";
import { createContext, useContext, type ReactNode } from "react";

const DemoModeContext = createContext(false);

export function DemoModeProvider({
  isDemoMode,
  children,
}: {
  isDemoMode: boolean;
  children: ReactNode;
}) {
  return (
    <DemoModeContext.Provider value={isDemoMode}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  return useContext(DemoModeContext);
}
```

### Step 3: Create DemoModeBanner

`components/DemoModeBanner.tsx`:
```tsx
"use client";
import { useDemoMode } from "./DemoModeProvider";

export function DemoModeBanner() {
  const isDemoMode = useDemoMode();
  if (!isDemoMode) return null;
  return (
    <div className="bg-yellow-500 text-black text-center py-2 text-sm font-medium">
      Demo-Modus - Eingeschraenkte Funktionalitaet. Anmeldedaten: demo@ipa.wid.li / demo1234
    </div>
  );
}
```

### Step 4: Wire into layout.tsx

Wrap children with DemoModeProvider, add DemoModeBanner after nav.

### Step 5: Add demo guard to API routes

Create `utils/demo-guard.ts`:
```ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isDemoUser } from "./demo";

export async function checkDemoRestriction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (isDemoUser(user?.email)) {
    return NextResponse.json(
      { error: "Diese Aktion ist im Demo-Modus nicht verfuegbar." },
      { status: 403 }
    );
  }
  return null;
}
```

Add guard to mutating endpoints:
- `app/api/subject_area/route.ts` POST
- `app/api/subject_area/[id]/route.ts` PATCH, DELETE
- `app/api/topic_complex/route.ts` POST
- `app/api/topic_complex/[id]/route.ts` PATCH, DELETE
- `app/api/question/route.ts` POST
- `app/api/question/[id]/route.ts` PATCH, DELETE
- `app/api/apprentice/route.ts` POST
- `app/api/apprentice/[id]/route.ts` PATCH, DELETE
- `app/api/difficulty/route.ts` POST
- `app/api/difficulty/[id]/route.ts` (if exists) PATCH, DELETE

Allow (no guard):
- All GET endpoints
- `app/api/assigned-apprentices/[questionId]/route.ts` POST (assign question)
- `app/api/assigned-apprentices/unassign/[questionId]/[apprenticeId]/route.ts` DELETE
- `app/api/question/[id]/comment/route.ts` PATCH (update comment)

### Step 6: Add demo mode UI restrictions

In all pages using mutation UI (buttons), check `useDemoMode()` and hide/disable:
- `app/page.tsx`: Hide Add/Edit/Delete Fachbereich buttons
- `app/fachbereich/[slug]/[themenkomplex]/page.tsx`: Hide Add/Edit/Delete question buttons. Keep "Add to Apprentice".
- `app/apprentices/page.tsx`: Hide "Add Apprentice" button
- `app/apprentices/[id]/ApprenticeDetail.tsx`: Hide "Edit Apprentice", keep comment editing

---

## Task 2: Bug Fix - Comment Update

**Files:**
- Modify: `app/api/question/[id]/comment/route.ts`
- Modify: `app/apprentices/[id]/ApprenticeDetail.tsx`

### Problem
The PATCH endpoint updates `apprentice_question` by `question_id` only, affecting ALL apprentices who have that question assigned. It needs to also filter by `apprentice_id`.

### Fix
Change the API call to include the apprentice_id. The frontend already has the apprentice ID from the page params.

In `ApprenticeDetail.tsx`:
- Change `updateComment()` to call `/api/question/${questionId}/comment` with body `{ comment, apprenticeId }`

In the API route:
- Add `.eq('apprentice_id', apprenticeId)` to the Supabase query

---

## Task 3: Answer Scoring (0-2)

**DB Changes (user runs manually in Supabase):**
```sql
ALTER TABLE apprentice_question ADD COLUMN score INTEGER DEFAULT NULL;
ALTER TABLE apprentice_question ADD COLUMN is_asked BOOLEAN DEFAULT FALSE;
```

**Files:**
- Modify: `app/api/question/[id]/comment/route.ts` - Accept score + is_asked in PATCH
- Modify: `app/apprentices/[id]/ApprenticeDetail.tsx` - Add score radio buttons + is_asked toggle
- Modify: `components/PDFGenerator.tsx` - Include score in PDF

### Score UI
Next to each question's comment textarea, add radio buttons:
- `--` (null/not scored)
- `0` - Nicht beantwortet
- `1` - Teilweise korrekt
- `2` - Korrekt

### Is Asked UI
A checkbox/toggle on each question card. When checked, add a visual indicator (green left border or checkmark badge).

### Score Summary
Per Themenkomplex accordion, show: "Bewertung: X / Y Punkte"

---

## Task 4: German UI

**Files to modify (all text changes):**
- `app/layout.tsx` - Nav links
- `app/page.tsx` - All headings, buttons, placeholders
- `app/apprentices/page.tsx` - All headings, buttons
- `app/apprentices/[id]/ApprenticeDetail.tsx` - All headings, labels, buttons
- `app/fachbereich/[slug]/[themenkomplex]/page.tsx` - All headings, buttons
- `app/questions/page.tsx` - All headings, buttons, labels
- `app/manage/page.tsx` - All headings, buttons
- `components/ApprenticeForm.tsx` - Form labels
- `components/AddQuestionOverlay.tsx` - Form labels
- `components/EditQuestionForm.tsx` - Form labels
- `components/AddSubjectForm.tsx` - Form labels
- `components/EditSubjectForm.tsx` - Form labels
- `components/PDFGenerator.tsx` - PDF headers
- `components/ApprenticeSelector.tsx` - Labels
- `components/ComingSoon.tsx` - Text
- `components/DemoModeBanner.tsx` - Already German
- Auth pages - Sign in/up text

---

## Task 5: Apprentice-Level PDF

**Files:**
- Create or modify: `components/ApprenticePDFGenerator.tsx`
- Modify: `app/apprentices/[id]/ApprenticeDetail.tsx` - Add "PDF exportieren" button

### PDF Content
- Header: Name, Projekttitel, Rolle, Datum
- Per Fachbereich/Themenkomplex: table with Frage, Erwartete Antwort, Bewertung, Kommentar
- Footer: Gesamtbewertung summary

---

## Task 6: Generate Questions SQL

Generate SQL INSERT statements for new topics and questions. User runs these in Supabase SQL editor.

New Themenkomplexe and ~10-15 questions each for:
- C# OOP, Fehlerbehandlung, LINQ, Async
- API/REST, Git, Security, CI-CD
- SQL Datenbankdesign, Unit Testing
- Fill up C# General (currently 2) and SQL Queries (currently 1)

---

## Task 7: Code Cleanup

- Remove commented-out code blocks
- Remove unused imports (e.g., `set` from zod)
- Remove `.bak` files
- Remove `console.log` statements
- Fix auth callback redirect path
