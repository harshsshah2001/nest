import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Visitor {
    name(email: string, name: any, id: number) {
        throw new Error("Method not implemented.");
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    phoneNumber: string;

    @Column()
    nationalId: string;

    @Column()
    email: string;

    @Column({ type: "time" })
    allocationTime: string;

    @Column({ type: "date" })
    date: string;
}
