import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsMobilePhone, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class UpdateProfileDto {

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

  @ApiPropertyOptional({ example: "Software Engineer" })
  @IsOptional()
  @IsString()
  biography?: string;
}

