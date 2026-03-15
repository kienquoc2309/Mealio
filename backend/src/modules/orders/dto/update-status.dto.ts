import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @IsIn([
    'pending',
    'confirmed',
    'preparing',
    'delivering',
    'delivered',
    'cancelled',
  ])
  @IsNotEmpty()
  orderStatus!: string;
}
