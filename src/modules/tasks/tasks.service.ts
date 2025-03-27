import { taskTable } from "@server/database/schema";
import { createService } from "@server/utils/service";
import { and, eq, like, or } from "drizzle-orm";
import type { Task, TaskService } from "./tasks.models";

const taskService = createService<TaskService>((ctx) => ({
  async create(task) {
    try {
      const createdTask = await ctx.db
        .insert(taskTable)
        .values(task)
        .returning();

      return createdTask[0];
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Failed to create task: ${err.message}`);
      }

      return null;
    }
  },

  async getAll(searchParams) {
    const {
      page = 1,
      limit = 10,
      order = "desc",
      orderBy = "createdAt",
      search,
    } = searchParams;

    try {
      const tasks = await ctx.db.query.taskTable.findMany({
        where: and(
          search
            ? or(
                like(taskTable.title, `%${search}%`),
                like(taskTable.description, `%${search}%`)
              )
            : undefined
        ),
        limit,
        offset: (page - 1) * limit,
        orderBy: orderBy
          ? (task, operation) => [operation[order](task[orderBy])]
          : undefined,
      });

      return tasks;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Failed to fetch tasks: ${err.message}`);
      }

      return null;
    }
  },

  async remove(taskId) {
    try {
      return ctx.db.delete(taskTable).where(eq(taskTable.id, taskId));
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(
          `Failed to remove task with ID ${taskId}: ${err.message}`
        );
      }
    }
  },

  async update(taskId, fields) {
    try {
      const rows = await ctx.db.update(taskTable).set(fields).returning();

      return rows[0];
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(
          `Failed to update task with ID ${taskId}: ${err.message}`
        );
      }

      return null;
    }
  },
}));

export { taskService };
