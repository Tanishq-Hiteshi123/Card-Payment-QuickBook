import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class QuickbooksService {
  private clientId = 'ABdbufOtqUGwQfkcZCyZIFQAp6vfIW5ckC5PRaxQPlrXX1QE41';
  private clientSecret = 'F0PSSLoDtMGFIxuwmIdq2MAcahfZ8gyRA0VSBkGs';
  private redirectUri = 'http://localhost:3000/quickbooks/oauth/callback';
  // private sandbox = true;

  constructor(private httpService: HttpService) {}
  async getAccessToken(authCode: string): Promise<any> {
    const url = `https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer`;
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
      'base64',
    );

    try {
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
    } catch (error) {
      throw new Error('Failed to obtain access token: ' + error.message);
    }
  }

  // async getCompanyInfo(accessToken: string, realmId: string): Promise<any> {
  //   const url = `https://quickbooks.api.intuit.com/v3/company/${realmId}/companyinfo/${realmId}`;

  //   try {
  //     const response = await lastValueFrom(
  //       this.httpService.get(url, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }),
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new Error('Failed to fetch company information: ' + error.message);
  //   }
  // }

  //   Function to process the card payment:
  async makeCardPayment(
    accessToken: string,
    amount: number,
    card: any,
    currency: any,
    context: any,
  ): Promise<any> {
    const url = `https://sandbox.api.intuit.com/quickbooks/v4/payments/charges`; // Use sandbox URL for testing

    // Construct the request body for the payment
    const requestId = uuidv4();
    console.log(requestId);
    const payload = {
      amount,
      currency,
      card,
      context,
    };

    console.log(payload);
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'request-id': uuidv4().replace(/-/g, '').slice(0, 50),
          },
        }),
      );

      return response.data; // Return the payment response
    } catch (error) {
      console.log(error.response.data);
      throw new Error('Failed to process payment: ' + error.message);
    }
  }
}
