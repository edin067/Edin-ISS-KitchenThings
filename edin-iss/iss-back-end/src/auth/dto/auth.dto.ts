import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  repeatPassword: string;

  @IsOptional()
  @IsString()
  imgUrl: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
