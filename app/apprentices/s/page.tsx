// This is a server component
import { ApprenticeInfo } from "@/components/ApprenticeInfo";
import { AssignedQuestions } from "@/components/AssignedQuestions";

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

async function getApprentice() {
  // Fetch apprentice data from your backend or database
  return {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    workLocation: "Berlin, Germany",
    projectTitle: "E-Commerce Platform Development",
    projectDescription: "Developing a scalable e-commerce platform using modern web technologies.",
    expertRole: "Hauptexperte" as "Hauptexperte" | "Nebenexperte",
    projectTopics: ["C#", "SQL"],
  };
}

async function getQuestions() {
  // Fetch grouped questions data
  return Promise.resolve(
    [
    {
        id: 1,
        question: "What is a variable in C#?",
        answer: "A variable in C# is a container for storing data values.",
        fachbereich: "C#",
        themenkomplex: "General",
        comment: "",
      },
      {
        id: 2,
        question: "Explain inheritance in C#",
        answer:
          "Inheritance is a mechanism where you can to derive a class from another class for a hierarchy of classes that share a set of attributes and methods.",
        fachbereich: "C#",
        themenkomplex: "General",
        comment: "",
      },
      {
        id: 3,
        question: "What is unit testing?",
        answer:
          "Unit testing is a software testing method by which individual units of source code are tested to determine whether they are fit for use.",
        fachbereich: "C#",
        themenkomplex: "Testing",
        comment: "",
      },
      {
        id: 4,
        question: "What is a primary key in SQL?",
        answer: "A primary key is a column or set of columns in a table that uniquely identifies each row in that table.",
        fachbereich: "SQL",
        themenkomplex: "Basic Queries",
        comment: "",
      },
      {
        id: 5,
        question: "Explain SQL JOIN",
        answer: "SQL JOIN is used to combine rows from two or more tables, based on a related column between them.",
        fachbereich: "SQL",
        themenkomplex: "Basic Queries",
        comment: "",
    }
])
}

async function groupQuestions(questions: Question[]): Promise<GroupedQuestions> {
    return questions.reduce((acc, question) => {
      if (!acc[question.fachbereich]) {
        acc[question.fachbereich] = {}
      }
      if (!acc[question.fachbereich][question.themenkomplex]) {
        acc[question.fachbereich][question.themenkomplex] = []
      }
      acc[question.fachbereich][question.themenkomplex].push(question)
      return acc
    }, {} as GroupedQuestions)
  }

export default async function ApprenticePage() {
  const apprentice = await getApprentice();
  const questions = await getQuestions();
  const groupedQuestions = await groupQuestions(questions);

  return (
    <div className="p-6">
      <ApprenticeInfo apprentice={apprentice} />
      <AssignedQuestions
        groupedQuestions={groupedQuestions}
      />
    </div>
  );
}
