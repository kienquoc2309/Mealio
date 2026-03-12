import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  foodId!: string;

  @IsInt()
  @Min(1)
  quantity: number = 1;
}
