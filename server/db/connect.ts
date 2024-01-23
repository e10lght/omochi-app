import { DataSource } from "typeorm";
import {
  DATABASE,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSSWORD,
  DATABASE_PORT,
  DATABASE_URL,
} from "../config/config";
import { Cleaning } from "../models/Cleaning.model";
import { Comments } from "../models/Comments.model";
import { Links } from "../models/Links.model";
import { Link_Categories } from "../models/Link_Categories.model";
import { Meals } from "../models/Meals.model";
import { Users } from "../models/Users.model";

const isProduction = process.env.NODE_ENV !== "dev";
const sslConfig = isProduction ? { rejectUnauthorized: false } : false;

export const AppDataSource = new DataSource({
  type: "postgres",
  url: DATABASE_URL,
  ssl: sslConfig,
  synchronize: true,
  logging: true,
  entities: [Users, Meals, Cleaning, Links, Link_Categories, Comments],
  subscribers: [],
  migrations: ["migrations/*.ts"],
});

AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
  })
  .catch((error) => console.error(error));
