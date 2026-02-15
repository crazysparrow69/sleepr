import { NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY') as string,
    );
  }

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    let result: Stripe.Charge | Stripe.PaymentIntent;

    if (typeof card === 'string') {
      result = await this.stripe.charges.create({
        amount: amount * 100,
        currency: 'usd',
        source: card,
      });
    } else {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card,
      });

      result = await this.stripe.paymentIntents.create({
        payment_method: paymentMethod.id,
        amount: amount * 100,
        confirm: true,
        payment_method_types: ['card'],
        currency: 'usd',
      });
    }

    this.notificationsService.emit('notify_email', {
      email,
      text: `Your payment of $${amount} has been successful.`,
    });

    return result;
  }
}
