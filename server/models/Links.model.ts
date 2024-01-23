import { link } from "fs";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Link_Categories } from "./Link_Categories.model";
import { Users } from "./Users.model";

@Entity()
export class Links {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  linkid!: string;

  @Column({
    unique: true,
  })
  categoryid!: string;

  @Column({
    length: 100,
  })
  title!: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  url!: string;

  @Column({
    type: "varchar",
    length: 1000,
  })
  description!: string;

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

  @ManyToOne(() => Link_Categories)
  @JoinColumn({ name: "categoryid" })
  link_categories!: Link_Categories;
}
