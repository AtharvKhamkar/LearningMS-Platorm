import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class RegisterDto {

  @ApiProperty({ example: "Atharv" })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @ApiPropertyOptional({ example: "Khamkar" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiProperty({ example: "atharvkhamkar1901@gmail.com" })
  @IsEmail()
  @IsString()
  @MaxLength(150)
  email: string;

  @ApiProperty({ example: "e819951e-eca1-49b5-9e2d-2e9b08208d6f" })
  @IsUUID()
  countryCodeId: string;

  @ApiProperty({ example: "694dcedf-ec52-4614-8cf6-a077b4d57e54" })
  @IsUUID()
  languageId: string;

  @ApiPropertyOptional({ example: "+919876543210" })
  @IsOptional()
  @IsMobilePhone()
  phoneNumber?: string;

  @ApiProperty({ example: "Test@123" })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: "Software Engineer" })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiProperty({ example: "1d5ef201-0972-4daa-b724-4325dcf28031" })
  @IsUUID()
  roleId: string
}

