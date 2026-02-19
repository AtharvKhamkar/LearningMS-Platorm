import { FileValidator } from "@nestjs/common";

export class CustomFileSizeValidator extends FileValidator<{
    maxSizeInBytes: number;
}> {

    isValid(file?: Express.Multer.File): boolean {
        if (!file) return false;
        return file.size <= this.validationOptions.maxSizeInBytes;
    }

    buildErrorMessage(): string {
        const mb = this.validationOptions.maxSizeInBytes / (1024 * 1024);
        return `File size exceeds ${mb}MB`;
    }
}