import { IsNotEmpty, IsString, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderAddressDto {
  @IsNotEmpty()
  @IsString()
  street!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsNotEmpty()
  @IsString()
  receiverName!: string;
}

export class PlaceOrderDto {
  @ValidateNested()
  @Type(() => OrderAddressDto)
  @IsNotEmpty()
  address!: OrderAddressDto;

  @IsIn(['stripe', 'vnpay', 'momo'])
  @IsNotEmpty()
  paymentMethod!: string;
}
