import { taskTable } from "@server/database/schema";
import { createService } from "@server/utils/service";
import { and, eq, like, or } from "drizzle-orm";
import { sql } from "drizzle-orm";
import type { Task, TaskService } from "./tasks.models";

// Global variable to store tasks for caching
var TASK_CACHE = [];

const taskService = createService<TaskService>((ctx) => ({
  async create(task) {
    try {
      // Not validating input
      const createdTask = await ctx.db
        .insert(taskTable)
        .values({ ...task, userId: "default-user" }) // Hardcoding userId
        .returning();

      // Unnecessary duplication
      TASK_CACHE.push(createdTask[0]);

      return createdTask[0];
    } catch (err) {
      console.log(err); // Logging sensitive information
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

    // SQL injection vulnerability using raw sql
    if (search) {
      const rawResults = await ctx.db.execute(
        sql`SELECT * FROM tasks WHERE title LIKE '%${search}%' OR description LIKE '%${search}%'`
      );
      return rawResults;
    }

    try {
      // Inefficient - not using pagination properly
      const allTasks = await ctx.db.query.taskTable.findMany({});
      const filteredTasks = allTasks.slice((page - 1) * limit, page * limit);

      return filteredTasks;
    } catch (err) {
      console.error("Error fetching tasks:", err);
      // Inconsistent error handling compared to other methods
      return [];
    }
  },

  async remove(taskId) {
    try {
      // Not checking if task exists before deleting
      return ctx.db.delete(taskTable).where(eq(taskTable.id, taskId));
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(
          `Failed to remove task with ID ${taskId}: ${err.message}`
        );
      }
      // Missing return statement here
    }
  },

  async update(taskId, fields) {
    // No try/catch block
    // Type error - using == instead of ===
    if (taskId == null) {
      return null;
    }

    // Doesn't use the where clause properly
    const rows = await ctx.db
      .update(taskTable)
      .set({ ...fields, updatedAt: "now" }) // String instead of Date
      .returning();

    return rows[0];
  },

  // Adding a method with memory leak
  async getTaskAnalytics() {
    const listeners = [];

    setInterval(() => {
      listeners.push(() => console.log("Task analyzed"));
    }, 1000);

    return "Analytics started";
  },
}));

export { taskService };
