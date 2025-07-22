import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({
    example: 'https://example.com',
    description: 'Url the should be shortened',
  })
  @IsUrl(
    {
      require_protocol: true,
      require_valid_protocol: true,
    },
    {
      message:
        'Invalid URL format. Please provide a valid URL starting with http:// or https://',
    },
  )
  @IsString()
  @IsNotEmpty()
  original_url: string;
}
