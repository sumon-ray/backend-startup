import { Schema, model } from "mongoose";
import { ICareer } from "./career.interface";

const careerSchema = new Schema<ICareer>(
    {
        title: { type: String, required: true },
        department: { type: String, required: true },
        jobType: {
            type: String,
            required: true,
            enum: ["full-time", "part-time", "remote"]
        },
        location: { type: String, required: true },
        responsibilities: { type: [String], required: true },
        requirements: { type: [String], required: true },
        salaryRange: {
            min: { type: Number, required: true },
            max: { type: Number, required: true },
        },
        deadline: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

export const CareerModel = model<ICareer>("Career", careerSchema);
