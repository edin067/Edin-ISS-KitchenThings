import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  imgUrl: string;

  @IsOptional()
  @IsString()
  steps: string;

  @IsOptional()
  @IsPositive()
  @IsNumber()
  cookingTime: number;
}
