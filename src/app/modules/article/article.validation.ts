import mongoose from 'mongoose';
import { z } from 'zod';

const createArticleSchema = z.object({
    title: z
        .string({ required_error: 'Title is required' })
        .min(3, 'Title must be at least 3 characters long'),

    slug: z
        .string({ required_error: 'Slug is required' })
        .min(3, 'Slug must be at least 3 characters long'),

    content: z
        .string({ required_error: 'Content is required' })
        .min(10, 'Content must be at least 10 characters long'),

    excerpt: z
        .string({ required_error: 'Excerpt is required' })
        .min(10, 'Excerpt must be at least 10 characters long'),

    coverImage: z.string().url('Cover image must be a valid URL').optional(),

    category: z
        .string({ required_error: 'Category is required' })
        .min(1, 'Category cannot be empty'),

    tags: z.array(z.string()).optional().default([]),

    author: z
        .string({ required_error: 'Author is required' })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: 'Invalid author ID format',
        }),

    readTime: z.coerce
        .number({
            required_error: 'Read time is required',
            invalid_type_error: 'Read time must be a number',
        })
        .positive('Read time must be a positive number'),

    publishedAt: z.coerce.date().optional(),

    isPublished: z.boolean().optional().default(false),
});

const updateArticleSchema = createArticleSchema.partial();

export const articleValidation = {
    createArticleSchema,
    updateArticleSchema,
};
