import type { dbSchema } from "@server/database/schema";
import type * as t from "@sinclair/typebox";

type Task = t.Static<typeof dbSchema.select.task>;

interface TaskService {
  getAll: (searchParams: PaginationParams<Task>) => Promise<Task[] | null>;
  create: (task: Pick<Task, "title" | "description">) => Promise<Task | null>;
  update: (
    taskId: string,
    task: Partial<Pick<Task, "title" | "description" | "completed">>
  ) => Promise<Task | null>;
  remove: (taskId: string) => void;
}

export type { Task, TaskService };
