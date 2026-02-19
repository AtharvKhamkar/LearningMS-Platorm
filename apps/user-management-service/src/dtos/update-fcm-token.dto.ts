import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateFcmToken {

  @ApiProperty({ example: "sjfsjlfjskjfsjlkflsdjflks" })
  @IsNotEmpty()
  @IsString()
  fcmToken: string;
}

