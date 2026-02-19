import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, IsUUID, Length, MaxLength, MinLength, length } from "class-validator";

export class VerifyForgotPasswordDto {
  @ApiProperty({ example: "123456" })
  @IsNotEmpty()
  @IsString()
  @Length(6)
  otp: string;
}

