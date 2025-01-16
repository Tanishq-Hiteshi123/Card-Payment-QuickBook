import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuickbooksModule } from './quickbooks/quickbooks.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
@Module({
  imports: [QuickbooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieParser(),
        session({
          secret: 'your-secret-key', // Replace with a more secure secret
          resave: false,
          saveUninitialized: true,
          cookie: { secure: false }, // Set to true if using HTTPS
        }),
      )
      .forRoutes('*'); // Apply to all routes
  }
}
