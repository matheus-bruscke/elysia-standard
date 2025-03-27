import { dbSchema } from "@server/database/schema";
import { taskService } from "./tasks.service";

import { searchSchema, toSearchParams } from "@server/utils/schemas";
import Elysia, { t } from "elysia";
import type { Task } from "./tasks.models";

const tasksController = new Elysia().group("/tasks", (app) =>
  app
    .get("/", ({ query }) => taskService.getAll(toSearchParams<Task>(query)), {
      query: searchSchema,
    })
    .post("/", ({ body }) => taskService.create(body), {
      body: t.Pick(dbSchema.select.task, ["title", "description"]),
    })
    .put("/:id", ({ body, params }) => taskService.update(params.id, body), {
      body: t.Pick(dbSchema.update.task, ["title", "description", "completed"]),
    })
    .delete("/:id", ({ params }) => taskService.remove(params.id))
);

export { tasksController };
