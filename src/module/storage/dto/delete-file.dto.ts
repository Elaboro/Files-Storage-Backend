import { ApiProperty } from "@nestjs/swagger";

export class DeleteFileDto {
  
  @ApiProperty({
    description: "ID of uploaded file.",
    example: 1
  })
  readonly id: number;
}
