import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Users } from "./Users.model";

@Entity()
export class Meals {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  mealid!: string;

  @Column({ type: "varchar" })
  userid!: string;

  @Column({
    length: 100,
  })
  status!: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  timeofday!: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  createdDate!: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdat!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedat!: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: "userid", referencedColumnName: "userid" })
  user!: Users;
}
