import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IArticle } from './article.interface';
import { ArticleModel } from './article.model';

// CREATE Article
const createArticle = async (payload: IArticle) => {
  // Check duplicate slug
  const existingBySlug = await ArticleModel.findOne({
    slug: payload.slug,
    isDeleted: false,
  }).lean();

  if (existingBySlug) {
    throw new AppError(
      httpStatus.CONFLICT,
      'An article with this slug already exists.',
      [
        {
          field: 'slug',
          message: `Slug "${payload.slug}" is already in use.`,
        },
      ],
    );
  }

  // Optionally check duplicate title (uncomment if desired)
  // const existingByTitle = await Article.findOne({
  //   title: payload.title,
  //   isDeleted: false,
  // }).lean();
  // if (existingByTitle) {
  //   throw new AppError(
  //     httpStatus.CONFLICT,
  //     'An article with this title already exists.',
  //     [
  //       {
  //         field: 'title',
  //         message: `Title "${payload.title}" is already in use.`,
  //       },
  //     ],
  //   );
  // }


  const result = await ArticleModel.create(payload);
  return result;
};

// GET All Articles
const getAllArticles = async () => {
  const result = await ArticleModel.find()
    .sort({ createdAt: -1 })


  if (!result || result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No articles found', []);
  }

  return result;
};

// GET Single Article By ID
const getArticleById = async (id: string) => {
  const result = await ArticleModel.findOne({
    _id: id
  })

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article not found', [
      {
        field: 'id',
        message: `No article found with ID: ${id}`,
      },
    ]);
  }
  return result;
};

// UPDATE Article 
const updateArticle = async (id: string, payload: Partial<IArticle>) => {
  if (payload.slug) {
    const existing = await ArticleModel.findOne({
      slug: payload.slug,
      _id: { $ne: id },
    }).lean();

    if (existing) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Another article with this slug already exists.',
        [
          {
            field: 'slug',
            message: `Slug "${payload.slug}" is already in use by another article.`,
          },
        ],
      );
    }
  }

  const result = await ArticleModel.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true },
  )

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article not found', [
      {
        field: 'id',
        message: `No article found with ID: ${id}`,
      },
    ]);
  }
  return result;
};

// DELETE Article
const deleteArticle = async (id: string) => {
  const result = await ArticleModel.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article not found', [
      {
        field: 'id',
        message: `No article found with ID: ${id}`,
      },
    ]);
  }

  return result;
};

export const articleService = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
