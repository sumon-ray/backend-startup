import { z } from "zod";

export const createCareerSchema = z.object({
    title: z
        .string({ required_error: "Title is required" })
        .min(3, "Title must be at least 3 characters long"),

    department: z
        .string({ required_error: "Department is required" })
        .min(2, "Department must be at least 2 characters long"),

    jobType: z.enum(["full-time", "part-time", "remote"], {
        required_error: "Job type is required",
    }),

    location: z
        .string({ required_error: "Location is required" })
        .min(2, "Location must be at least 2 characters long"),

    responsibilities: z
        .array(z.string().min(1, "Responsibility cannot be empty"))
        .min(1, "At least one responsibility is required"),

    requirements: z
        .array(z.string().min(1, "Requirement cannot be empty"))
        .min(1, "At least one requirement is required"),

    salaryRange: z.object({
        min: z.number({ required_error: "Minimum salary is required" }).nonnegative(),
        max: z.number({ required_error: "Maximum salary is required" }).nonnegative(),
    }),

    deadline: z.coerce.date({ required_error: "Deadline is required" }),

    isActive: z.boolean().optional().default(true),
});

export const updateCareerSchema = createCareerSchema.partial();

export const careerValidation = {
    createCareerSchema,
    updateCareerSchema,
};
