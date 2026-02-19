import { FileValidator, Injectable } from "@nestjs/common";
import { extname } from "path";
import type { FileTypeValidatorOptions } from "../types/common.types";

@Injectable()
export class CustomFileTypeValidator extends FileValidator<FileTypeValidatorOptions> {
    constructor(
        protected readonly validationOptions: FileTypeValidatorOptions
    ) {
        super(validationOptions);
    }

    isValid(file?: Express.Multer.File): boolean {
        if (!file) return false;

        const { mimetype, originalname } = file;
        const extension = extname(originalname);

        if (!this.validationOptions.allowedMimeTypes?.includes(mimetype)) {
            return false;
        }

        if (this.validationOptions.allowedExtensions && !this.validationOptions.allowedExtensions?.includes(extension)) {
            return false;
        }

        return true;
    }

    buildErrorMessage(): string {

        const { allowedMimeTypes, allowedExtensions } = this.validationOptions;

        return `Invalid file type. Allowed mime types: ${allowedMimeTypes.join(
            ', ',
        )}${allowedExtensions
            ? ` | Allowed extensions: ${allowedExtensions.join(', ')}`
            : ''
            }`;

    }
}