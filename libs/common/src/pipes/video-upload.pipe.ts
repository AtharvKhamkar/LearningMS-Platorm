import { ParseFilePipe } from "@nestjs/common";
import { CustomFileTypeValidator } from "../validators/file-type.validator";
import { AllowedVideoExtensions, AllowedVideoMimeTypes } from "../types/common.types";

export const VideoUploadPipe = new ParseFilePipe({
    validators:[
        new CustomFileTypeValidator({
            allowedMimeTypes: AllowedVideoMimeTypes,
            allowedExtensions: AllowedVideoExtensions
        })
    ]
})