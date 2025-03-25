// item.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Item } from './item.entity';
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { MailService } from "./mail/mail.service";


@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item) 
        private itemRepository: Repository<Item>,
        private mailService: MailService
    ) {}

    // item.service.ts (partial update)
async create(item: Partial<Item>): Promise<Item> {
  const newItem = this.itemRepository.create(item);
  newItem.password = await bcrypt.hash(newItem.password, 10);
  const savedItem = await this.itemRepository.save(newItem);
  try {
    await this.mailService.sendRegistrationEmail(savedItem.email, savedItem.name, savedItem.id); // Pass the id
  } catch (error) {
    console.error('Failed to send registration email:', error);
  }
  return savedItem;
}

    findAll(): Promise<Item[]> {
        return this.itemRepository.find();
    }

    async findOne(id: string): Promise<Item> {
        const item = await this.itemRepository.findOneBy({ id: Number(id) });
        if (!item) {
            throw new NotFoundException('Item not found');
        }
        return item;
    }

    async update(id: string, item: Partial<Item>): Promise<void> {
        if (item.password) {
            item.password = await bcrypt.hash(item.password, 10);
        }
        const result = await this.itemRepository.update(id, item);
        if (result.affected === 0) {
            throw new NotFoundException('Item not found');
        }
    }

    async remove(id: string): Promise<void> {
        const result = await this.itemRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Item not found');
        }
    }
}