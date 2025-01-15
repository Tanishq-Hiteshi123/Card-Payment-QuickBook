import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuickbooksModule } from './quickbooks/quickbooks.module';

@Module({
  imports: [QuickbooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
