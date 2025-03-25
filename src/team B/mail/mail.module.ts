import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { VisitorMailService } from '../appointment/visitor-mail/visitor-mail.service';


@Module({
  providers: [MailService, VisitorMailService],
  exports: [MailService, VisitorMailService],
})
export class MailModule {}