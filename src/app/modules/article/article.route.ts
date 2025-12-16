import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { articleController } from './article.controller';
import { articleValidation } from './article.validation';

const router = express.Router();

router.post(
    '/',
    validateRequest(articleValidation.createArticleSchema),
    articleController.createArticle,
);

router.get(
    '/',
    articleController.getAllArticles,
);

router.get(
    '/:id',
    articleController.getArticleById,
);

router.patch(
    '/:id',
    validateRequest(articleValidation.updateArticleSchema),
    articleController.updateArticle,
);

router.delete(
    '/:id',
    articleController.deleteArticle,
);

export const articleRoutes = router;
