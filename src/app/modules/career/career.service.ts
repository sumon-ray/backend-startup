import httpStatus from "http-status";
import AppError from "../../error/appError";
import { ICareer } from "./career.interface";
import { CareerModel } from "./career.model";

// CREATE Career
const createCareer = async (payload: ICareer) => {
    // check duplicate title
    const existing = await CareerModel.findOne({
        title: payload.title,
    }).lean();

    if (existing) {
        throw new AppError(
            httpStatus.CONFLICT,
            "A career with this title already exists.",
            [
                {
                    field: "title",
                    message: `Title "${payload.title}" is already in use.`,
                },
            ]
        );
    }

    const result = await CareerModel.create(payload);
    return result;
};

// GET All Careers
const getAllCareers = async () => {
    const result = await CareerModel.find().sort({ createdAt: -1 });

    if (!result || result.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "No careers found", []);
    }

    return result;
};

// GET Single Career By ID
const getCareerById = async (id: string) => {
    const result = await CareerModel.findOne({ _id: id });

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Career not found", [
            {
                field: "id",
                message: `No career found with ID: ${id}`,
            },
        ]);
    }

    return result;
};

// UPDATE Career
const updateCareer = async (id: string, payload: Partial<ICareer>) => {
    // duplicate title check
    if (payload.title) {
        const existing = await CareerModel.findOne({
            title: payload.title,
            _id: { $ne: id },
        }).lean();

        if (existing) {
            throw new AppError(
                httpStatus.CONFLICT,
                "Another career with this title already exists.",
                [
                    {
                        field: "title",
                        message: `Title "${payload.title}" is already in use by another career.`,
                    },
                ]
            );
        }
    }

    const result = await CareerModel.findByIdAndUpdate(
        id,
        { $set: payload },
        { new: true, runValidators: true }
    );

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Career not found", [
            {
                field: "id",
                message: `No career found with ID: ${id}`,
            },
        ]);
    }

    return result;
};

// DELETE Career
const deleteCareer = async (id: string) => {
    const result = await CareerModel.findByIdAndDelete(id);

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Career not found", [
            {
                field: "id",
                message: `No career found with ID: ${id}`,
            },
        ]);
    }

    return result;
};

export const careerService = {
    createCareer,
    getAllCareers,
    getCareerById,
    updateCareer,
    deleteCareer,
};
