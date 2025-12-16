import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { careerService } from "./career.service";

// CREATE Career
const createCareer = catchAsync(async (req: Request, res: Response) => {
    const result = await careerService.createCareer(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Career created successfully",
        data: result,
    });
});

// GET ALL Careers
const getAllCareers = catchAsync(async (req: Request, res: Response) => {
    const result = await careerService.getAllCareers();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All careers fetched successfully",
        data: result,
    });
});

// GET Career BY ID
const getCareerById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await careerService.getCareerById(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Career fetched successfully",
        data: result,
    });
});

// UPDATE Career
const updateCareer = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await careerService.updateCareer(id, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Career updated successfully",
        data: result,
    });
});

// DELETE Career
const deleteCareer = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await careerService.deleteCareer(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Career permanently deleted successfully",
        data: null,
    });
});

export const careerController = {
    createCareer,
    getAllCareers,
    getCareerById,
    updateCareer,
    deleteCareer,
};
