import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { SheetClose, SheetFooter } from "./ui/sheet";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { Input } from "./ui/input";
import { useDifficulties } from "@/hooks/use-difficulties";

// Define the schema for the question form
const questionSchema = z.object({
  id: z.number(),
  question: z.string().min(1, "Frage ist erforderlich"),
  answer: z.string().min(1, "Antwort ist erforderlich"),
  difficulty: z.number().min(1, "Schwierigkeitsauswahl ist erforderlich").default(1),
  tags: z.array(z.string()).default([]),
})

type QuestionFormData = z.infer<typeof questionSchema>

interface EditQuestionFormProps {
  question: QuestionFormData
  onEdit: (data: QuestionFormData) => Promise<void>
}

export default function EditQuestionForm({
  question,
  onEdit
}: EditQuestionFormProps) {
  const { difficulties, isLoading: loading } = useDifficulties();
  const [newTag, setNewTag] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    mode: "onChange",
    defaultValues: {
      id: question.id,
      question: question.question,
      answer: question.answer,
      difficulty: question.difficulty,
      tags: question.tags || [],
    }
  });

  const tags = watch("tags")
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedDifficultyId = watch("difficulty");

  const onSubmit = async (data: QuestionFormData) => {
    setIsSubmitting(true);
    try {
      await onEdit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim()) {
      setValue("tags", [...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTags = (entry: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== entry),
    )
  }

  function getTextColor(color: string) {
    return color.includes("yellow") || color.includes("gray") ? "text-black" : "text-white";
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div>
          <Label htmlFor="question">Frage</Label>
          <Textarea
            id="question"
            className="mt-1"
            {...register("question")}
          />
          {errors.question && (
            <p className="text-red-500 text-sm mt-1">{errors.question.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="answer">Antwort</Label>
          <Textarea
            id="answer"
            className="mt-1"
            {...register("answer")}
          />
          {errors.answer && (
            <p className="text-red-500 text-sm mt-1">{errors.answer.message}</p>
          )}
        </div>

        <div>
          <Label>Schwierigkeit</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.id}
                type="button"
                onClick={() => setValue("difficulty", difficulty.id, {
                  shouldValidate: true
                })}
                className={cn(
                  "px-3 py-1 rounded-lg text-sm font-medium transition-colors border-2",
                  selectedDifficultyId === difficulty.id
                    ? "border-blue-500 bg-blue-200 shadow-lg shadow-blue-300 scale-105"
                    : "border-transparent hover:border-gray-400",
                  difficulty.color,
                  getTextColor(difficulty.color)
                )}
              >
                {difficulty.name}
              </button>
            ))}
          </div>
          {errors.difficulty && (
            <p className="text-red-500 text-sm mt-1">{errors.difficulty.message}</p>
          )}
        </div>

        <div>
          <Label>Schlagwörter</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {/* if tags is undefined or empty display a text, otherwise map over the tags */}
            {!tags || tags.length === 0 ? (
              <p className="text-gray-500">Keine Schlagwörter hinzugefügt</p>
            ) : (
              tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => removeTags(tag)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))
            )}
          </div>
          <div className="flex mt-2">
            <Input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Neues Schlagwort"
              className="mr-2"
            />
            <Button type="button" onClick={addTag}>
              Schlagwort hinzufügen
            </Button>
          </div>
        </div>
      </div>

      <SheetFooter>
        <SheetClose asChild>
          <Button
            type="submit"
            disabled={!isValid || isSubmitting || loading}
          >
            {isSubmitting ? "Speichern..." : "Änderungen speichern"}
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
}