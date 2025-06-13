import expres, { Express } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "./generated/prisma";
import { errorMiddleware } from "./middlewares/errors";

const app: Express = expres();

app.use(expres.json());
app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("App working");
});
