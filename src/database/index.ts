import { neon } from "@neondatabase/serverless";
import { env } from "@server/utils/env";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const client = neon(env.DATABASE_URL);

const db = drizzle({ client, schema });

type Database = typeof db;

export type { Database };
export { db };
