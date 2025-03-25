// item.module.ts (create this if you don't have it)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]), // Add MailModule here
    MailModule,
  ],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}