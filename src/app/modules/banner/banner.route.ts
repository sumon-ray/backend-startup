import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { bannerController } from './banner.controller';
import { bannerValidation } from './banner.validation';

const router = express.Router();

router.post(
    '/',
    validateRequest(bannerValidation.createBannerSchema),
    bannerController.createBanner,
);

router.get(
    '/',
    bannerController.getAllBanners,
);

router.get(
    '/:id',
    bannerController.getBannerById,
);

router.patch(
    '/:id',
    validateRequest(bannerValidation.updateBannerSchema),
    bannerController.updateBanner,
);

router.delete(
    '/:id',
    bannerController.deleteBanner,
);

export const bannerRoutes = router;
