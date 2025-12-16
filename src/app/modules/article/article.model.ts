import { model, Schema } from "mongoose";
import { IArticle } from "./article.interface";

const ArticleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: String,
      required: true,
    },
    readTime: {
      type: Number,
      required: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


export const ArticleModel = model<IArticle>('Article', ArticleSchema)
