import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IBanner } from './banner.interface';
import { BannerModel } from './banner.model';

// CREATE Banner
const createBanner = async (payload: IBanner) => {
  // prevent duplicate heading
  const existingHeading = await BannerModel.findOne({
    heading: payload.heading,
  }).lean();

  if (existingHeading) {
    throw new AppError(
      httpStatus.CONFLICT,
      'A banner with this heading already exists.',
      [
        {
          field: 'heading',
          message: `Heading "${payload.heading}" is already in use.`,
        },
      ]
    );
  }

  const result = await BannerModel.create(payload);
  return result;
};

// GET All Banners
const getAllBanners = async () => {
  const result = await BannerModel.find().sort({ createdAt: -1 });

  if (!result || result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No banners found', []);
  }

  return result;
};

// GET Single Banner By ID
const getBannerById = async (id: string) => {
  const result = await BannerModel.findOne({ _id: id });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Banner not found', [
      {
        field: 'id',
        message: `No banner found with ID: ${id}`,
      },
    ]);
  }

  return result;
};

// UPDATE Banner
const updateBanner = async (id: string, payload: Partial<IBanner>) => {
  // duplicate heading check
  if (payload.heading) {
    const existing = await BannerModel.findOne({
      heading: payload.heading,
      _id: { $ne: id },
    }).lean();

    if (existing) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Another banner with this heading already exists.',
        [
          {
            field: 'heading',
            message: `Heading "${payload.heading}" is already in use by another banner.`,
          },
        ]
      );
    }
  }

  const result = await BannerModel.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Banner not found', [
      {
        field: 'id',
        message: `No banner found with ID: ${id}`,
      },
    ]);
  }

  return result;
};

// HARD DELETE Banner
const deleteBanner = async (id: string) => {
  const result = await BannerModel.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Banner not found', [
      {
        field: 'id',
        message: `No banner found with ID: ${id}`,
      },
    ]);
  }

  return result;
};

export const bannerService = {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
};
