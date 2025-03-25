import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { VisitorService } from "./visitor.service";
import { Visitor } from "./visitor.entity";

@Controller('visitors')
export class VisitorController {
    constructor(private visitorService: VisitorService) { }

    @Post()
    async create(@Body() visitor: Visitor) {
        return this.visitorService.create(visitor);
    }
}