import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  date: string;

  @Column({type: 'time', nullable: true })
  allocatedTime: string;

  @Column({ nullable: true })
  visitorEmail: string;

  @Column({ nullable: true })
  national_id: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  mobile_number: string;

  @Column({ nullable: true })
  personal_details: string;

  @Column({ nullable: true })
  note: string;
}