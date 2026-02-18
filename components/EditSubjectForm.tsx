import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { SheetClose, SheetFooter } from "./ui/sheet";
import { Button } from "./ui/button";
import { useState } from "react";
import { Fachbereich } from "@/app/model/Fachbereich";

export const fachbereichSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  description: z.string().min(2, "Beschreibung muss mindestens 3 Zeichen lang sein"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug muss aus Kleinbuchstaben und Bindestrichen bestehen"),
});

type FachbereichForm = z.infer<typeof fachbereichSchema>;

interface EditSubjectFormProps {
  subject: Fachbereich;
  onEdit: (data: FachbereichForm) => void;
}

export default function EditSubjectForm({ subject, onEdit }: EditSubjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FachbereichForm>({
    resolver: zodResolver(fachbereichSchema),
    mode: "onChange",
    defaultValues: {
      name: subject.name,
      description: subject.description,
      slug: subject.slug,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FachbereichForm) => {
    setIsSubmitting(true);
    try {
      await onEdit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Beschreibung</Label>
          <Input id="description" {...register("description")} />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
          {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
        </div>
      </div>

      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? "Speichern..." : "Änderungen speichern"}
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
}