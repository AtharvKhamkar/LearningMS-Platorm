import { ApiProperty } from "@nestjs/swagger";

export class UpdateCoverImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}
