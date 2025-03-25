import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './login+register/item.module';
import { AuthModule } from './login+register/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';
import { VisitorModule } from './team A/employee_sends_visitor_data/visitor.module';
import { AppointmentModule } from './team B/appointment/appointment.module';
import { MailService } from './team B/mail/mail.service';
import { MailModule } from './login+register/mail/mail.module';


@Module({
  imports: [
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'CURD',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Ensure entities are loaded
      autoLoadEntities: true,
      synchronize: true,
    }),
    ItemModule,
    AuthModule,
    MailModule,
    VisitorModule,
    AppointmentModule,
  ],
  
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
