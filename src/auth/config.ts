import { db } from "@server/database";
import {
  accountTable,
  sessionTable,
  userTable,
  verificationTable,
} from "@server/database/schema";
import { env } from "@server/utils/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";

const TRUSTED_ORIGINS = [env.CLIENT_ORIGIN];

export const auth = betterAuth({
  plugins: [bearer()],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: userTable,
      account: accountTable,
      verification: verificationTable,
      session: sessionTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: TRUSTED_ORIGINS,
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});
