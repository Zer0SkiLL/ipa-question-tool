import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ApprenticeOverviewForm } from "@/app/model/Apprentice";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

const apprenticeSchema = z.object({
  firstName: z.string().min(2, "Vorname muss mindestens 2 Zeichen lang sein"),
  lastName: z.string().min(2, "Nachname muss mindestens 2 Zeichen lang sein"),
  workLocation: z.string().optional(),
  projectTitle: z.string().optional(),
  projectDescription: z.string().optional(),
  expertRole: z.enum(["Hauptexperte", "Nebenexperte"], { message: "Ungültige Expertenrolle" }),
  projectTopics: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

type ApprenticeFormValues = z.infer<typeof apprenticeSchema>;

interface ApprenticeFormProps {
  apprentice?: ApprenticeOverviewForm;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apprentice: ApprenticeOverviewForm) => void;
}

export function ApprenticeForm({ apprentice, isOpen, onClose, onSubmit }: ApprenticeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
    watch,
    trigger,
  } = useForm<ApprenticeFormValues>({
    resolver: zodResolver(apprenticeSchema),
    defaultValues: apprentice || {
      firstName: "",
      lastName: "",
      workLocation: "",
      projectTitle: "",
      projectDescription: "",
      expertRole: "Nebenexperte",
      projectTopics: [],
      isActive: true,
    },
    mode: "onChange",
  });

  const handleFormSubmit = (data: ApprenticeFormValues) => {
    const mappedData: ApprenticeOverviewForm = {
      firstName: data.firstName,
      lastName: data.lastName,
      workLocation: data.workLocation || "",
      projectTitle: data.projectTitle || "",
      projectDescription: data.projectDescription || "",
      expertRole: data.expertRole,
      projectTopics: data.projectTopics || [],
      isActive: data.isActive,
    }

    onSubmit(mappedData);
  };

  useEffect(() => {
    if (apprentice) {
      setValue("firstName", apprentice.firstName)
      setValue("lastName", apprentice.lastName)
      setValue("workLocation", apprentice.workLocation || "")
      setValue("projectTitle", apprentice.projectTitle || "")
      setValue("projectDescription", apprentice.projectDescription || "")
      setValue("expertRole", apprentice.expertRole)
      setValue("isActive", apprentice.isActive ?? true)
      trigger()
    }
  }, [apprentice, setValue, trigger]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>{apprentice ? "Lernende/r bearbeiten" : "Neue/n Lernende/n hinzufügen"}</SheetTitle>
          <SheetDescription>
            {apprentice
              ? "Ändern Sie hier die Informationen zum Lernenden. Klicken Sie auf Speichern, wenn Sie fertig sind."
              : "Fügen Sie hier eine/n neue/n Lernende/n hinzu. Mit * markierte Felder sind Pflichtfelder."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Vorname *</Label>
            <Input id="firstName" {...register("firstName")} />
            {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nachname *</Label>
            <Input id="lastName" {...register("lastName")} />
            {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="workLocation">Arbeitsort (Google Maps Link)</Label>
            <Input id="workLocation" {...register("workLocation")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectTitle">Projekttitel</Label>
            <Input id="projectTitle" {...register("projectTitle")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Projektbeschreibung</Label>
            <Textarea id="projectDescription" {...register("projectDescription")} />
          </div>
          <div className="space-y-2">
            <Label>Expertenrolle *</Label>
            <RadioGroup
              defaultValue={apprentice?.expertRole || "Nebenexperte"}
              onValueChange={(value) => {
                setValue("expertRole", value as "Hauptexperte" | "Nebenexperte")
                trigger("expertRole")
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Hauptexperte" id="hauptexperte" />
                <Label htmlFor="hauptexperte">Hauptexperte</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Nebenexperte" id="nebenexperte" />
                <Label htmlFor="nebenexperte">Nebenexperte</Label>
              </div>
            </RadioGroup>
            {errors.expertRole && <p className="text-red-500">{errors.expertRole.message}</p>}
          </div>
          {apprentice && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={watch("isActive") ?? true}
                onChange={(e) => {
                  setValue("isActive", e.target.checked)
                  trigger("isActive")
                }}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isActive">Aktiv</Label>
            </div>
          )}
          <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Speichern..." : "Speichern"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
