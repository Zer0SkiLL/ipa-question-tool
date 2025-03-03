import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { SheetClose, SheetFooter } from "./ui/sheet";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Difficulty } from "@/app/model/Difficulty";
import { cn } from "@/lib/utils";
import { Question } from "@/app/model/Question";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { Input } from "./ui/input";

// Define the schema for the question form
const questionSchema = z.object({
  id: z.number(),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  difficulty: z.number().min(1, "Difficulty selection is required").default(1),
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
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const fetchDifficulties = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/difficulty");
        const data = await res.json();
        setDifficulties(data);
      } catch (error) {
        console.error("Error fetching difficulties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDifficulties();
  }, []);

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
          <Label htmlFor="question">Question</Label>
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
          <Label htmlFor="answer">Answer</Label>
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
          <Label>Difficulty</Label>
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
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {/* if tags is undefined or empty display a text, otherwise map over the tags */}
            {!tags || tags.length === 0 ? (
              <p className="text-gray-500">No Tags added</p>
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
              placeholder="New tag"
              className="mr-2"
            />
            <Button type="button" onClick={addTag}>
              Add Tag
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
}