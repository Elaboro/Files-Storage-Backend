import { ApiProperty } from "@nestjs/swagger";

export class UploadFilesDto {
  @ApiProperty({
    description: "32-byte key (aes-256-ctr).",
    example: "jZ39Sigy2VR2nmMQk7gbP2uDpR4czooD"
  })
  readonly key: string;

  @ApiProperty({
    type: "array",
    items: {
      type: "file",
      format: "binary"
    }
  })
  readonly files: Array<Express.Multer.File>;
}
