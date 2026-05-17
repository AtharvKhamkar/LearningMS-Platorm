import { ApiProperty } from "@nestjs/swagger";

export class UploadVideoLectureDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  video: any;
}
