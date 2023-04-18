import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import Stripe from 'stripe';

export class CreateChangeDto {
  @IsObject()
  @IsNotEmpty()
  card: Stripe.PaymentMethodCreateParams.Card1;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
