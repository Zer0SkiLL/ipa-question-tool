import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { SheetClose, SheetFooter } from "./ui/sheet";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useDifficulties } from "@/hooks/use-difficulties";

// Define the schema for the question form
const questionSchema = z.object({
  question: z.string().min(1, "Frage ist erforderlich"),
  answer: z.string().min(1, "Antwort ist erforderlich"),
  difficulty: z.number().min(1, "Schwierigkeitsauswahl ist erforderlich").default(1),
  tags: z.array(z.string()).default([]),
});

type QuestionForm = z.infer<typeof questionSchema>;

export default function AddQuestionForm({ 
    onAdd
  }: { 
    onAdd: (data: QuestionForm) => void;
  }) {
  const { difficulties, isLoading: loading } = useDifficulties();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),
    mode: "onChange",
  });

  const [isSubmitting] = useState(false);
  const selectedDifficultyId = watch("difficulty");

  useEffect(() => {
    if (difficulties.length > 0) {
      setValue("difficulty", difficulties[0].id);
    }
  }, [difficulties, setValue]);

  const onSubmit = (data: QuestionForm) => {
    onAdd(data);
  };

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
      </div>

      <SheetFooter>
        <SheetClose asChild>
          <Button 
            type="submit" 
            disabled={!isValid || isSubmitting || loading}
          >
            {isSubmitting ? "Speichern..." : "Speichern"}
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
}