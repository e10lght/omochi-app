import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Link_Categories {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  categoryid!: string;

  @Column({
    length: 100,
  })
  name!: string;

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
}
