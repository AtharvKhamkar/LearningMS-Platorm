import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "atharvkhamkar1901@gmail.com" })
  @IsEmail()
  @IsString()
  @MaxLength(150)
  email: string;

  @ApiProperty({ example: "Test@123" })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

