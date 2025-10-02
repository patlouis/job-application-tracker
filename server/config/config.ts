// config.ts
import { cleanEnv, str, num } from "envalid";
import dotenv from "dotenv";

dotenv.config();

export const env = cleanEnv(process.env, {
  DB_HOST: str(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_NAME: str(),
  DB_PORT: num({ default: 3300 }),
});
