import { NextFunction, Request, Response } from 'express';
import AppError from '../error/appError';
import { fileUploads } from '../helpers/fileUploader';

export const handleUploads = (
    options: {
        multiple?: boolean
        replace?: boolean
        targetField?: string
        required?: boolean
    } = {},
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                multiple = false,
                replace = false,
                targetField,
                required = true,
            } = options
            const fieldName: string = multiple
                ? targetField || 'images'
                : targetField || 'image'
            // MULTIPLE UPLOAD
            if (multiple) {
                let uploadedImages: { url: string; alt?: string }[] = []
                let existingItems: any[] = []

                // Load existing items from the determined fieldName
                if (req.body[fieldName]) {
                    try {
                        existingItems =
                            typeof req.body[fieldName] === 'string'
                                ? JSON.parse(req.body[fieldName])
                                : req.body[fieldName]
                    } catch {
                        existingItems = req.body[fieldName]
                    }
                }

                // Upload new files
                if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                    uploadedImages = await Promise.all(
                        (req.files as Express.Multer.File[]).map(async (file) => {
                            const uploadRes = await fileUploads.uploadToCloudinary(file)
                            return {
                                url: uploadRes.secure_url,
                                name: file.originalname,
                                type: file.mimetype,
                            }
                        }),
                    )
                }

                // Apply Replace/Merge Logic
                if (replace && uploadedImages.length === 0) {
                    return next()
                }

                req.body[fieldName] = replace
                    ? uploadedImages
                    : [...existingItems, ...uploadedImages]
            }

            // SINGLE UPLOAD
            else {

                let file: Express.Multer.File | undefined = req.file as Express.Multer.File | undefined;
                // Check if multiple files are uploaded in single upload route
                if (!file) {
                    const fileArray = req.files && (req.files as any)[fieldName];
                    file = fileArray && Array.isArray(fileArray) && fileArray.length > 0
                        ? fileArray[0]
                        : undefined;

                    if (file && fileArray.length > 1) {
                        throw new AppError(400, `Only a single file upload is allowed for ${fieldName}`);
                    }
                }

                if (file) {
                    const uploadRes = await fileUploads.uploadToCloudinary(file);

                    req.body[fieldName] = {
                        url: uploadRes.secure_url,
                        name: file.originalname,
                        type: file.mimetype,
                    };
                }
                // Check for requirement (required=true by default)
                else if (required && !req.body[fieldName]) {
                    throw new AppError(400, `${fieldName} field is required`);
                };
            };

            next()
        } catch (error: any) {
            console.error("Cloudinary Error Details:", error);
            next(new AppError(error.statusCode || 500, error.message || 'Error uploading file(s)'));
        };
    };
};