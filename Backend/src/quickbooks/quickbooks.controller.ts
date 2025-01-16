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
    // Generate a random state
    const state = 'abc' + Math.floor(Math.random() * 1000); // Example: generates a 32-character random string

    // Store the state in session
    console.log('State valiue is ', state);
    session.state = state;

    const clientId = 'ABdbufOtqUGwQfkcZCyZIFQAp6vfIW5ckC5PRaxQPlrXX1QE41';
    const redirectUri = 'http://localhost:3000/quickbooks/oauth/callback';

    console.log(clientId, redirectUri);

    // Build the QuickBooks OAuth URL with the dynamically generated state
    const quickBooksUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${clientId}&response_type=code&scope=com.intuit.quickbooks.payment&redirect_uri=${redirectUri}&state=${state}`;

    return {
      url: quickBooksUrl, // This will redirect the user to QuickBooks
    };
  }

  @Get('oauth/callback')
  async handleOAuthCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('realmId') realmId: string, // realmId (companyId) is passed in the callback URL
    @Session() session: any, // Access session for storing the state
  ) {
    // Retrieve the expected state from session
    const expectedState = session.state;
    console.log(code, state, realmId);
    // Validate that the state matches the one you sent (to prevent CSRF attacks)
    if (state !== expectedState) {
      throw new Error('State does not match, possible CSRF attack');
    }

    // Now that we've validated the state, let's retrieve the access token

    try {
      // Exchange the authorization code for an access token
      const tokenData = await this.quickBooksService.getAccessToken(code);

      // Store the token or return it to the user (depending on your use case)
      return tokenData; // This can be returned as a response or saved to a session/database
    } catch (error) {
      // If the token exchange fails, throw an error
      throw new Error('Failed to obtain access token: ' + error.message);
    }
  }

  @Get('company-info')
  async getCompanyInfo(
    @Query('accessToken') accessToken: string,
    @Query('realmId') realmId: string,
  ) {
    try {
      // Call service to get company info using the access token and realmId
      const companyInfo = await this.quickBooksService.getCompanyInfo(
        accessToken,
        realmId,
      );
      return companyInfo;
    } catch (error) {
      throw new Error('Failed to retrieve company info: ' + error.message);
    }
  }

  @Post('pay')
  async processPayment(
    @Body('accessToken') accessToken: string,
    @Body('amount') amount: number,
    @Body('card') card: any,
    @Body('realmId') realmId: any,
    @Body('currency') currency: any,
    @Body('context') context: any,
  ) {
    try {
      return await this.quickBooksService.makeCardPayment(
        accessToken,
        amount,
        card,
        realmId,
        currency,
        context,
      );
    } catch (error) {
      throw new Error('Payment processing failed: ' + error.message);
    }
  }
}
