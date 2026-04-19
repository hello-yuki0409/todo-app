import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const app = new Hono();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

const todos: Todo[] = [];

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/todos", (c) => {
  return c.json({ todos });
});

app.post("/todos", async (c) => {
  const { title } = await c.req.json();
  const todo = {
    id: todos.length + 1,
    title,
    completed: false,
  };
  todos.push(todo);
  return c.json({ todo });
});

app.put("/todos/:id", async (c) => {
  const { id } = c.req.param();
  const { completed } = await c.req.json();
  const todo = todos.find((todo) => todo.id === Number(id));

  if (!todo) {
    return c.notFound();
  }

  todo.completed = completed;
  return c.json({ todos });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
