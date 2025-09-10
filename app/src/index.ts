import { Elysia, t } from "elysia";

export const app = new Elysia()
  .post(
    '/create-epub',
    ({ body }) => body,
    {
      body: t.Object({
        url: t.String(),
        name: t.String(),
      }),
    }
  )
  .get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
