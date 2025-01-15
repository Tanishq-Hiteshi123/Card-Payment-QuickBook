import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { QuickbooksService } from './quickbooks.service';

@Controller('quickbooks')
export class QuickbooksController {
  constructor(private readonly quickBooksService: QuickbooksService) {}

  @Get('oauth/callback')
  async handleOAuthCallback(@Query('code') code: string) {
    const tokenData = await this.quickBooksService.getAccessToken(code);
    return tokenData;
  }

  @Post('pay')
  async processPayment(
    @Body('accessToken') accessToken: string,
    @Body('amount') amount: number,
    @Body('cardInfo') cardInfo: any,
  ) {
    return this.quickBooksService.makeCardPayment(
      accessToken,
      amount,
      cardInfo,
    );
  }
}
