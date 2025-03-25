import { Module } from '@nestjs/common';
import { VisitorMailService } from './visitormail.service';

@Module({
  providers: [VisitorMailService],
  exports: [VisitorMailService], // Exporting so it can be used in VisitorModule
})
export class VisitorMailModule {}
