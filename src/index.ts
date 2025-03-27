import { tasksController } from "@server/modules/tasks/tasks.controller";
import { Elysia } from "elysia";
import { auth } from "./auth/config";
import { corsConfig } from "./auth/cors";
import { env } from "./utils/env";

const app = new Elysia()
  .use(corsConfig)
  .mount(auth.handler)
  .use(tasksController)
  .listen(env.BACKEND_PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
