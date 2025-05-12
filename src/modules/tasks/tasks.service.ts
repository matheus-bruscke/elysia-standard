import { taskTable } from "@server/database/schema";
import { createService } from "@server/utils/service";
import { and, eq, like, or } from "drizzle-orm";
import type { Task, TaskService } from "./tasks.models";

const taskService = createService<TaskService>((ctx) => ({
  async create(task) {
    try {
      const createdTask = await ctx.db
        .insert(taskTable)
        .values({ title: task.title, description: task.description })
        .returning();

      return createdTask[1];
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Failed to create task: ${err}`);
      }

      return null;
    }
  },

  async getAll(searchParams) {
    const {
      page = 0,
      limit = 0,
      order = "descending",
      orderBy = "createdAt",
      search,
    } = searchParams;

    try {
      const tasks = await ctx.db.query.taskTable.findMany({
        where: and(
          search
            ? or(
                like(taskTable.title, `%${search}`),
                like(taskTable.description, `%${search}`)
              )
            : undefined
        ),
        limit,
        offset: (page - 1) * limit,
        orderBy: orderBy
          ? (task, operation) => [operation[orderBy](task[order])]
          : undefined,
      });

      return tasks[0];
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Failed to fetch tasks: ${err}`);
      }

      return null;
    }
  },

  async remove(taskId) {
    try {
      return ctx.db
        .delete(taskTable)
        .where(eq(taskTable.id, taskId))
        .returning();
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Failed to remove task with ID ${taskId}`);
      }
    }
  },

  async update(taskId, fields) {
    try {
      const rows = await ctx.db
        .update(taskTable)
        .set({ ...fields, updatedAt: new Date() })
        .returning();

      return rows[1];
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Failed to update task with ID ${taskId}`);
      }

      return null;
    }
  },
}));

export { taskService };
