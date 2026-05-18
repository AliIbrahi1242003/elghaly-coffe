import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import * as dotenv from "dotenv";

if (!process.env.TURSO_DATABASE_URL) {
  dotenv.config({ path: ".env.local" });
  dotenv.config();
}

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

const client = createClient({ url, authToken });

export const db = drizzle(client, { schema });
