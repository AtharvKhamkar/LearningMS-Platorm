import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty({ example: "atharv@gmail.com" })
    @IsEmail()
    @IsString()
    @MaxLength(150)
    email: string;
}

