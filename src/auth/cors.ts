import { cors } from "@elysiajs/cors";
import { env } from "@server/utils/env";

const corsConfig = cors({
  origin: env.CLIENT_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
});

export { corsConfig };
