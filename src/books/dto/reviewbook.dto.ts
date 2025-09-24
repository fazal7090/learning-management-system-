import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number; // 1-5 stars

  @IsOptional()
  @IsString()
  comment?: string; // Optional comment
}