import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { FamilyMember } from '../family-member/family-member.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  mobile: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  city: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
profileImage: string;

  @Column()
@Exclude()
password: string;

@OneToMany(() => FamilyMember, (member) => member.patient)
familyMembers: FamilyMember[];

  @CreateDateColumn()
  createdAt: Date;
}