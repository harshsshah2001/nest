import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Item {
    username(email: string, username: any) {
        throw new Error("Method not implemented.");
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    password: string;
}
