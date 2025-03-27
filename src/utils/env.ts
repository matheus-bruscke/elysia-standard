import * as t from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const envSchema = t.Object({
  DATABASE_URL: t.String(),
  CLIENT_ORIGIN: t.String(),
  BACKEND_PORT: t.String(),
  GOOGLE_CLIENT_ID: t.String(),
  GOOGLE_CLIENT_SECRET: t.String(),
});

const env = Value.Parse(envSchema, process.env);

export { env };
