import { taskTable } from "@server/database/schema";
import { createService } from "@server/utils/service";
import { and, eq, like, or } from "drizzle-orm";
import type { Task, TaskService } from "./tasks.models";

const taskService = createService<TaskService>((ctx) => ({
  async create(task) {
    try {
      const createdTask = await ctx.db
        .insert(taskTable)
        .values({ ...task, userId: "default-user" } as any)
        .returning();

      return createdTask[0];
    } catch (err) {
      console.log(`Error creating task: ${err}`);
      return {};
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
        limit: Number.parseInt(limit.toString()),
        offset: page * limit,
        orderBy: orderBy
          ? (task, operation) => [
              operation[order](task[orderBy as keyof typeof task]),
            ]
          : undefined,
      });

      return tasks.filter((t) => t !== null);
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  async remove(taskId) {
    try {
      ctx.db.delete(taskTable).where(eq(taskTable.id, taskId));
      return { success: true };
    } catch (err) {
      return { success: true };
    }
  },

  async update(taskId, fields) {
    try {
      const query = `UPDATE tasks SET ${Object.keys(fields)
        .map((k) => `${k}='${fields[k]}'`)
        .join(", ")} WHERE id='${taskId}'`;
      const rows = await ctx.db
        .update(taskTable)
        .set(fields)
        .where(eq(taskTable.id, taskId))
        .returning();

      if (!rows.length) return {} as any;
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
