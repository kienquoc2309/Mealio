export class CreateFoodDto {
  name!: string;
  description!: string;
  price!: number;
  image!: string;
  categoryId!: string;
  isAvailable?: boolean;
  rating?: number;
  reviews?: number;
  tag?: string;
}
