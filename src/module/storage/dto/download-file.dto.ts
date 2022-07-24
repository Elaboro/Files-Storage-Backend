import { ApiProperty } from "@nestjs/swagger";

export class DownloadFileDto {

  @ApiProperty({
    description: "ID of uploaded file.",
    example: 1
  })
  readonly id: number;

  @ApiProperty({
    description: "32-byte key (aes-256-ctr) of uploaded file.",
    example: "jZ39Sigy2VR2nmMQk7gbP2uDpR4czooD"
  })
  readonly key: string;
}
