export interface IArticle {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  readTime: number;
  publishedAt: Date | string;
  isPublished: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};
