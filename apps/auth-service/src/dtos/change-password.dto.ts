import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({ example: "Strong@123" })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}