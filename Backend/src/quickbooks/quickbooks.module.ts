import { Module } from '@nestjs/common';
import { QuickbooksService } from './quickbooks.service';
import { QuickbooksController } from './quickbooks.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [QuickbooksService],
  controllers: [QuickbooksController],
})
export class QuickbooksModule {}
