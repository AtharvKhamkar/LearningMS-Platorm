import { ParseFilePipe } from "@nestjs/common";
import { CustomFileTypeValidator } from "../validators/file-type.validator";
import { AllowedImageExtensions, AllowedImageMimeTypes } from "../types/common.types";
import { CustomFileSizeValidator } from "../validators/file-size.validator";

export const ImageUploadPipe = new ParseFilePipe({
    validators:[
        new CustomFileTypeValidator({
            allowedMimeTypes: AllowedImageMimeTypes,
            allowedExtensions: AllowedImageExtensions
        }),

        new CustomFileSizeValidator({
            maxSizeInBytes: 2 * 1024 * 1024
        })
    ]
})