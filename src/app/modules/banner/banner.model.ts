import { Schema, model } from "mongoose";
import { IBanner } from "./banner.interface";

const bannerSchema = new Schema<IBanner>(
  {
    heading: { type: String, required: true },
    subheading: { type: String, required: true },
    description: { type: String, required: true },
    backgroundImage: { type: String, required: true },
    showcaseProjects: {
      type: [[String]],
      required: true,
      default: [],
    },
     
    callToAction: {
      label: { type: String, required: true }, 
      url: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const BannerModel = model<IBanner>("Banner", bannerSchema);
