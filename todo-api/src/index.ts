import { serve } from "@hono/node-server";
import { PrismaPg } from "@prisma/adapter-pg";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { PrismaClient } from "./generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const app = new Hono();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/todos", async (c) => {
  const todos = await prisma.todo.findMany();
  return c.json({ todos });
});

app.post("/todos", async (c) => {
  const { title } = await c.req.json();
  const todo = await prisma.todo.create({
    data: {
      title,
      completed: false,
    },
  });
  return c.json({ todo });
});

app.put("/todos/:id", async (c) => {
  const { id } = c.req.param();
  const { completed } = await c.req.json();
  try {
    const todo = await prisma.todo.update({
      where: { id: Number(id) },
      data: { completed },
    });
    return c.json({ todo });
  } catch {
    return c.notFound();
  }
});

serve(
  {
    fetch: app.fetch,
    hostname: "0.0.0.0",
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
