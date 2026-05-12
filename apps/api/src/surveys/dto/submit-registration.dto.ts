import { IsString, IsNotEmpty, IsEmail, IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitRegistrationDto {
  @IsString() @IsNotEmpty() first_name: string;
  @IsString() @IsNotEmpty() last_name: string;

  @Type(() => Number)
  @IsInt() @Min(5) @Max(99) age: number;

  @IsEmail() email: string;

  @IsString() @IsOptional() telegram?: string;

  @IsString() @IsNotEmpty() school: string;
  @IsString() @IsNotEmpty() grade: string;
}
