import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { careerController } from "./career.controller";
import { careerValidation } from "./career.validation";

const router = express.Router();

router.post(
    "/",
    validateRequest(careerValidation.createCareerSchema),
    careerController.createCareer
);
router.get("/", careerController.getAllCareers);
router.get("/:id", careerController.getCareerById);
router.patch(
    "/:id",
    validateRequest(careerValidation.updateCareerSchema),
    careerController.updateCareer
);
router.delete("/:id", careerController.deleteCareer);
export const careerRoutes = router;
