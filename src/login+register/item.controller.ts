import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Item } from "./item.entity";
import { ItemService } from "./item.service";

@Controller('items')
export class ItemController {
    constructor(private itemService: ItemService) { }

    @Post()
    async create(@Body() item: Item) {
        return this.itemService.create(item);
    }

    @Get()
    findAll() {
        return this.itemService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.itemService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() item: Partial<Item>) {
        return this.itemService.update(id, item);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.itemService.remove(id);
    }

    
}
