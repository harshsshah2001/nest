import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Visitor } from "./visitor.entity";
import { VisitorMailService } from "./visitormail.service";

@Injectable()
export class VisitorService {
    constructor(
        @InjectRepository(Visitor) 
        private visitorRepository: Repository<Visitor>,
        private visitorMailService: VisitorMailService
    ) {}

    // Create a new visitor record and send registration email
    async create(visitor: Partial<Visitor>): Promise<Visitor> {
        console.log("Received visitor data:", visitor); // Debugging log
    
        // Fix date format issue: Convert DD-MM-YYYY to YYYY-MM-DD
        if (visitor.date) {
            const [day, month, year] = visitor.date.split('-');
            visitor.date = `${year}-${month}-${day}`; // Correct format for PostgreSQL
        }

        const newVisitor = this.visitorRepository.create(visitor);
        const savedVisitor = await this.visitorRepository.save(newVisitor);
    
        console.log("Saved visitor:", savedVisitor); // Log saved visitor
    
        try {
            console.log("Sending email to:", savedVisitor.email); // Debugging log
            await this.visitorMailService.sendVisitorQRCode(savedVisitor); 
        } catch (error) {
            console.error("Email sending failed:", error);
        }
    
        return savedVisitor;
    }
}