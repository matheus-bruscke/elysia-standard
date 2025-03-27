import { type Database, db } from "@server/database";

type ServiceContext = {
  db: Database;
};

const context: ServiceContext = {
  db,
};

function createService<T>(service: (ctx: ServiceContext) => T) {
  return service(context);
}

export { createService };
