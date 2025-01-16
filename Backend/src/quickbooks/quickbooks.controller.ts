import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Session,
} from '@nestjs/common';
import { QuickbooksService } from './quickbooks.service';

@Controller('quickbooks')
export class QuickbooksController {
  constructor(private readonly quickBooksService: QuickbooksService) {}

  @Get('oauth')
  @Redirect()
  async initiateOAuth(@Session() session: any) {
    const state = 'abc' + Math.floor(Math.random() * 1000);

    console.log('State valiue is ', state);
    session.state = state;

    const clientId = 'ABdbufOtqUGwQfkcZCyZIFQAp6vfIW5ckC5PRaxQPlrXX1QE41';
    const redirectUri = 'http://localhost:3000/quickbooks/oauth/callback';

    console.log(clientId, redirectUri);

    const quickBooksUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${clientId}&response_type=code&scope=com.intuit.quickbooks.payment&redirect_uri=${redirectUri}&state=${state}`;

    return {
      url: quickBooksUrl,
    };
  }

  @Get('oauth/callback')
  async handleOAuthCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('realmId') realmId: string,
    @Session() session: any,
  ) {
    const expectedState = session.state;
    console.log(code, state, realmId);
    if (state !== expectedState) {
      throw new Error('State does not match, possible CSRF attack');
    }

    try {
      const tokenData = await this.quickBooksService.getAccessToken(code);

      return tokenData;
    } catch (error) {
      throw new Error('Failed to obtain access token: ' + error.message);
    }
  }

  // @Get('company-info')
  // async getCompanyInfo(
  //   @Query('accessToken') accessToken: string,
  //   @Query('realmId') realmId: string,
  // ) {
  //   try {
  //     // Call service to get company info using the access token and realmId
  //     const companyInfo = await this.quickBooksService.getCompanyInfo(
  //       accessToken,
  //       realmId,
  //     );
  //     return companyInfo;
  //   } catch (error) {
  //     throw new Error('Failed to retrieve company info: ' + error.message);
  //   }
  // }

  @Post('pay')
  async processPayment(
    @Body('accessToken') accessToken: string,
    @Body('amount') amount: number,
    @Body('card') card: any,
    @Body('currency') currency: any,
    @Body('context') context: any,
  ) {
    try {
      return await this.quickBooksService.makeCardPayment(
        accessToken,
        amount,
        card,
        currency,
        context,
      );
    } catch (error) {
      throw new Error('Payment processing failed: ' + error.message);
    }
  }
}
