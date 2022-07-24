import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {

  @ApiProperty({
    example: "user",
    type: String,
  })
  readonly username: string;

  @ApiProperty({
    example: "user",
    type: String,
  })
  readonly password: string;

  @ApiProperty({
    example: "user@user.user",
    type: String,
  })
  readonly email: string;
}

export class LoginUserDto extends RegisterUserDto {}
