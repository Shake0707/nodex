import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateSurveyDto {
  @IsString() @IsNotEmpty() title_uz: string;
  @IsString() @IsNotEmpty() title_en: string;
  @IsString() @IsNotEmpty() title_ru: string;

  @IsString() @IsNotEmpty() description_uz: string;
  @IsString() @IsNotEmpty() description_en: string;
  @IsString() @IsNotEmpty() description_ru: string;

  @IsString() @IsNotEmpty() marquee_text_uz: string;
  @IsString() @IsNotEmpty() marquee_text_en: string;
  @IsString() @IsNotEmpty() marquee_text_ru: string;

  @IsBoolean() @IsOptional() is_active?: boolean;

  @IsDateString() starts_at: string;

  @IsDateString() @IsOptional() ends_at?: string;
}
