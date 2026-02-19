import { ApiProperty } from "@nestjs/swagger";

export class UpdateProfileImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}
