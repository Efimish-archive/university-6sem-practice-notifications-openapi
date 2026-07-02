import { Elysia } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { jwt } from "@elysiajs/jwt";
import { z } from "zod";

export const context = new Elysia({ name: "context" })
  .use(bearer())
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      exp: "7d",
      schema: z.object({
        sub: z.string(),
      }),
    }),
  )
  .model({
    nothing: z.null().meta({ description: "Пустой ответ" }),
    error: z
      .object({
        message: z.string().meta({
          description:
            "Понятное сообщение об ошибке, которое можно сразу показать пользователю в интерфейсе",
          examples: ["Неверные данные для входа"],
        }),
        code: z
          .literal([400, 401])
          .meta({ description: "HTTP-статус ответа (код)" }),
      })
      .meta({ description: "Стандартный объект ошибки" }),
  });
