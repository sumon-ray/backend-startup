import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import { bannerService } from './banner.service';

// CREATE Banner
const createBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await bannerService.createBanner(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Banner created successfully',
    data: result,
  });
});

// GET ALL Banners
const getAllBanners = catchAsync(async (req: Request, res: Response) => {
  const result = await bannerService.getAllBanners();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All banners fetched successfully',
    data: result,
  });
});

// GET Banner by ID
const getBannerById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await bannerService.getBannerById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Banner fetched successfully',
    data: result,
  });
});

// UPDATE Banner
const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await bannerService.updateBanner(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Banner updated successfully',
    data: result,
  });
});

// DELETE Banner
const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await bannerService.deleteBanner(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Banner permanently deleted successfully',
    data: null,
  });
});

export const bannerController = {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
};
