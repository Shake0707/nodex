import { IsString, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class UpdateSurveyDto {
  @IsString() @IsOptional() title_uz?: string;
  @IsString() @IsOptional() title_en?: string;
  @IsString() @IsOptional() title_ru?: string;

  @IsString() @IsOptional() description_uz?: string;
  @IsString() @IsOptional() description_en?: string;
  @IsString() @IsOptional() description_ru?: string;

  @IsString() @IsOptional() marquee_text_uz?: string;
  @IsString() @IsOptional() marquee_text_en?: string;
  @IsString() @IsOptional() marquee_text_ru?: string;

  @IsBoolean() @IsOptional() is_active?: boolean;

  @IsDateString() @IsOptional() starts_at?: string;

  @IsDateString() @IsOptional() ends_at?: string;
}
