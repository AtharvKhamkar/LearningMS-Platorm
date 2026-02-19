import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, MaxLength } from "class-validator";

export class VerifyUserDto {
  @ApiProperty({ example: "atharv@gmail.com" })
  @IsEmail()
  @IsString()
  @MaxLength(150)
  email: string;

  @ApiProperty({ example: "123456" })
    @IsNotEmpty()
    @IsString()
    @Length(6)
    otp: string;
}

