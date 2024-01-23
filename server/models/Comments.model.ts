import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Users } from "./Users.model";

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  commentid!: string;

  @Column({
    unique: true,
  })
  userid!: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  message!: string;

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
