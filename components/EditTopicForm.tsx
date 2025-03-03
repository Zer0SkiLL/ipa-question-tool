import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { SheetClose, SheetFooter } from "./ui/sheet";
import { Button } from "./ui/button";
import { Themenkomplex } from "@/app/model/Themenkomplex";

// Schema can be similar to fachbereich since the structure is the same
export const topicSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
});

type TopicForm = z.infer<typeof topicSchema>;

interface AddTopicFormProps {
  onAdd: (data: TopicForm) => void;
}

export function EditTopicForm({ 
    topic, 
    onEdit 
  }: { 
    topic: Themenkomplex; 
    onEdit: (data: TopicForm) => void;
  }) {
    const {
      register,
      handleSubmit,
      formState: { errors, isValid },
    } = useForm<TopicForm>({
      resolver: zodResolver(topicSchema),
      mode: "onChange",
      defaultValues: {
        name: topic.name,
        description: topic.description,
        slug: topic.slug,
      },
    });
  
    const onSubmit = (data: TopicForm) => {
      onEdit(data);
    };
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="edit-name">Name</Label>
            <Input id="edit-name" {...register("name")} />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Input id="edit-description" {...register("description")} />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          </div>
          <div>
            <Label htmlFor="edit-slug">Slug</Label>
            <Input id="edit-slug" {...register("slug")} />
            {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" disabled={!isValid}>
              Save Changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    );
  }