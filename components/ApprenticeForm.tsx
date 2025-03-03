// import type React from "react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
// import { ApprenticeOverview, ApprenticeOverviewForm } from "@/app/model/Apprentice"

// // interface Apprentice {
// //   id?: number
// //   name: string
// //   workLocation: string
// //   projectTitle: string
// //   projectDescription: string
// //   expertRole: "Hauptexperte" | "Nebenexperte"
// //   projectTopics: string[]
// //   active: boolean
// // }

// interface ApprenticeFormProps {
//   apprentice?: ApprenticeOverviewForm
//   isOpen: boolean
//   onClose: () => void
//   onSubmit: (apprentice: ApprenticeOverviewForm) => void
// }

// export function ApprenticeForm({ apprentice, isOpen, onClose, onSubmit }: ApprenticeFormProps) {
//   const [formData, setFormData] = useState<ApprenticeOverviewForm>(
//     apprentice || {
//       firstName: "",
//       lastName: "",
//       workLocation: "",
//       projectTitle: "",
//       projectDescription: "",
//       expertRole: "Hauptexperte",
//       projectTopics: [],
//     },
//   )

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     onSubmit(formData)
//   }

//   return (
//     <Sheet open={isOpen} onOpenChange={onClose}>
//       <SheetContent className="sm:max-w-[425px]">
//         <SheetHeader>
//           <SheetTitle>{apprentice ? "Edit Apprentice" : "Add New Apprentice"}</SheetTitle>
//           <SheetDescription>
//             {apprentice
//               ? "Make changes to the apprentice information here. Click save when you're done."
//               : "Add a new apprentice here. Fields marked with * are required."}
//           </SheetDescription>
//         </SheetHeader>
//         <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//           <div className="space-y-2">
//             <Label htmlFor="name">Firstname *</Label>
//             <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="name">Lastname *</Label>
//             <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="workLocation">Work Location</Label>
//             <Input id="workLocation" name="workLocation" value={formData.workLocation} onChange={handleChange} />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="projectTitle">Project Title</Label>
//             <Input id="projectTitle" name="projectTitle" value={formData.projectTitle} onChange={handleChange} />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="projectDescription">Project Description</Label>
//             <Textarea
//               id="projectDescription"
//               name="projectDescription"
//               value={formData.projectDescription}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label>Expert Role *</Label>
//             <RadioGroup
//               name="expertRole"
//               value={formData.expertRole}
//               onValueChange={(value) =>
//                 setFormData((prev) => ({ ...prev, expertRole: value as "Hauptexperte" | "Nebenexperte" }))
//               }
//               required
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="Hauptexperte" id="hauptexperte" />
//                 <Label htmlFor="hauptexperte">Hauptexperte</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="Nebenexperte" id="nebenexperte" />
//                 <Label htmlFor="nebenexperte">Nebenexperte</Label>
//               </div>
//             </RadioGroup>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="active">Status</Label>
//             <RadioGroup
//               name="active"
//               value={formData.active ? "active" : "inactive"}
//               onValueChange={(value) => setFormData((prev) => ({ ...prev, active: value === "active" }))}
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="active" id="active" />
//                 <Label htmlFor="active">Active</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="inactive" id="inactive" />
//                 <Label htmlFor="inactive">Inactive</Label>
//               </div>
//             </RadioGroup>
//           </div>
//           <Button type="submit">Save</Button>
//         </form>
//       </SheetContent>
//     </Sheet>
//   )
// }



import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ApprenticeOverviewForm } from "@/app/model/Apprentice";

const apprenticeSchema = z.object({
  firstName: z.string().min(2, "Firstname must be at least 2 characters"),
  lastName: z.string().min(2, "Lastname must be at least 2 characters"),
  workLocation: z.string().optional(),
  projectTitle: z.string().optional(),
  projectDescription: z.string().optional(),
  expertRole: z.enum(["Hauptexperte", "Nebenexperte"], { message: "Invalid expert role" }),
  projectTopics: z.array(z.string()).optional(),
  active: z.boolean(),
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
      active: true,
    },
  });

  const handleFormSubmit = (data: ApprenticeFormValues) => {
    onSubmit(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>{apprentice ? "Edit Apprentice" : "Add New Apprentice"}</SheetTitle>
          <SheetDescription>
            {apprentice
              ? "Make changes to the apprentice information here. Click save when you're done."
              : "Add a new apprentice here. Fields marked with * are required."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Firstname *</Label>
            <Input id="firstName" {...register("firstName")} />
            {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Lastname *</Label>
            <Input id="lastName" {...register("lastName")} />
            {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="workLocation">Work Location</Label>
            <Input id="workLocation" {...register("workLocation")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectTitle">Project Title</Label>
            <Input id="projectTitle" {...register("projectTitle")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Project Description</Label>
            <Textarea id="projectDescription" {...register("projectDescription")} />
          </div>
          <div className="space-y-2">
            <Label>Expert Role *</Label>
            <RadioGroup onValueChange={(value) => setValue("expertRole", value as "Hauptexperte" | "Nebenexperte")}>
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
          <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
