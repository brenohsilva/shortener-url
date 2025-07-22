import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'usernames' })
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'user email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    example: '123456',
    description: 'user password',
    minLength: 6,
  })
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
