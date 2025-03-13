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

// Define the schema for the question form
const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  difficulty: z.number().min(1, "Difficulty selection is required").default(1),
  tags: z.array(z.string()).default([]),
});

type QuestionForm = z.infer<typeof questionSchema>;

export default function AddQuestionForm({ 
    onAdd
  }: { 
    onAdd: (data: QuestionForm) => void;
  }) {
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [loading, setLoading] = useState(false);

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
    const fetchDifficulties = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/difficulty");
        const data = await res.json();
        setDifficulties(data);
        // Set default difficulty
        if (data.length > 0) {
            console.log("dificulty data in addquestion form", data);
          setValue("difficulty", data[0].id);
        }
      } catch (error) {
        console.error("Error fetching difficulties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDifficulties();
  }, [setValue]);

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
      </div>

      <SheetFooter>
        <SheetClose asChild>
          <Button 
            type="submit" 
            disabled={!isValid || isSubmitting || loading}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
}