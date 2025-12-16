import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import { Readable } from 'stream'
import config from '../config'
import { IUploadedImage } from '../interfaces/file'

// Cloudinary config
cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
})

// Use memory storage instead of writing to disk
const storage = multer.memoryStorage();
// const upload = multer({ storage });
const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
},);

// Helper to convert buffer to stream
const bufferToStream = (buffer: Buffer) => {
    const readable = new Readable()
    readable._read = () => { }
    readable.push(buffer)
    readable.push(null)
    return readable
}

// Function to upload file buffer to Cloudinary
const uploadToCloudinary = async (
    file: Express.Multer.File,
): Promise<IUploadedImage> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'uploads',
                resource_type: 'auto',
                type: 'upload',
                access_control: [{ access_type: 'anonymous' }],
            },

            (error, result) => {
                if (error) return reject(error)

                resolve({
                    secure_url: result?.secure_url || '',
                    public_id: result?.public_id || '',
                })
            },
        )

        bufferToStream(file.buffer).pipe(uploadStream)
    })
}
export const fileUploads = {
    upload,
    uploadToCloudinary,
}