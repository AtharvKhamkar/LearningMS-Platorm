import { ApiProperty } from "@nestjs/swagger";

export class UpdateCourseThumbnail {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  thumbnail: any;
}
