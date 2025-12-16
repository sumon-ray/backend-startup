import { z } from "zod";

// Global custom error
z.setErrorMap((issue) => ({
    message: issue.message || "Invalid input",
}));

// Reusable URL schema
const urlSchema = z
    .string()
    .trim()
    .url("Must be a valid URL")
    .regex(/^https?:\/\/.+/, "URL must start with http or https");

// Create banner schema
const createBannerSchema = z
    .object({
        heading: z
            .string({ required_error: "Heading is required" })
            .trim()
            .min(3, "Heading must be at least 3 characters long"),

        subheading: z
            .string({ required_error: "Subheading is required" })
            .trim()
            .min(3, "Subheading must be at least 3 characters long"),

        description: z
            .string({ required_error: "Description is required" })
            .trim()
            .min(10, "Description must be at least 10 characters long"),

        backgroundImage: urlSchema,

        showcaseProjects: z
            .array(
                z.tuple([
                    z
                        .string()
                        .trim()
                        .min(1, "Project name cannot be empty"),
                    urlSchema,
                ])
            )
            .optional()
            .default([]),

        callToAction: z.object({
            label: z
                .string({ required_error: "CTA label is required" })
                .trim()
                .min(2, "CTA label must be at least 2 characters long"),

            url: urlSchema,
        }),

        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
    })
    .strict({ message: "Unknown fields are not allowed" });

// Update schema
const updateBannerSchema = createBannerSchema.partial();

export const bannerValidation = {
    createBannerSchema,
    updateBannerSchema,
};
