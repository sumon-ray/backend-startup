import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import { articleService } from './article.service';

// CREATE Article
const createArticle = catchAsync(async (req: Request, res: Response) => {
  const result = await articleService.createArticle(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Article created successfully',
    data: result,
  });
});

// GET ALL Articles
const getAllArticles = catchAsync(async (req: Request, res: Response) => {
  const result = await articleService.getAllArticles();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All articles fetched successfully',
    data: result,
  });
});

// GET Article BY ID
const getArticleById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await articleService.getArticleById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Article fetched successfully',
    data: result,
  });
});

// UPDATE Article
const updateArticle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await articleService.updateArticle(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Article updated successfully',
    data: result,
  });
});

// DELETE Article
const deleteArticle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await articleService.deleteArticle(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Article permanently deleted successfully',
    data: null,
  });
});

export const articleController = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
