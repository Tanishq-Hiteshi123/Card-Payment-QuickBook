import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class QuickbooksService {
  private clientId = process.env.CLIENT_ID;
  private clientSecret = process.env.CLIENT_SECRET;
  private redirectUri = process.env.REDIRECT_URL;
  private sandbox = true;

  constructor(private httpService: HttpService) {}

  //   Creating the function of getting the access Token :-
  async getAccessToken(authCode: string): Promise<any> {
    const url = `https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer`;
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
      'base64',
    );

    const response = await lastValueFrom(
      this.httpService.post(
        url,
        `grant_type=authorization_code&code=${authCode}&redirect_uri=${this.redirectUri}`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    return response.data;
  }

  //   Making the Card Payment :-

  async makeCardPayment(
    accessToken: string,
    amount: number,
    cardInfo: any,
  ): Promise<any> {
    const url = `${this.sandbox ? 'https://sandbox-' : 'https://'}quickbooks.api.intuit.com/v3/company/YOUR_COMPANY_ID/payments/charges`;

    const response = await lastValueFrom(
      this.httpService.post(
        url,
        {
          amount,
          card: cardInfo,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    return response.data;
  }
}
