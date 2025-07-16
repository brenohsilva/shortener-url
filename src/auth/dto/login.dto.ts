import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'user email',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    example: 'password',
    description: 'user password',
  })
  @IsNotEmpty()
  password: string;
}
