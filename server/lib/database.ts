import mysql, { Pool } from "mysql2/promise";
import { env } from "../config/config";

let pool: Pool | null = null;

export const connectToDatabase = async (): Promise<Pool> => {
  if (!pool) {
    pool = mysql.createPool({
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("Connected to the database");
  }
  return pool;
};
