import { Elysia } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { jwt } from "@elysiajs/jwt";
import { z } from "zod";
import { env } from "@/env";
import { HttpError, ErrorSchema } from "@/error";

export const UnauthorizedError = new HttpError(401, "Вы не авторизованы");

export const context = new Elysia({ name: "context" })
  .use(bearer())
  .use(
    jwt({
      name: "jwt",
      secret: env.JWT_SECRET,
      exp: "365d",
      schema: z.object({
        sub: z.string(),
      }),
    }),
  )
  .model({
    nothing: z.null().meta({ description: "Пустой ответ" }),
    error: ErrorSchema,
  })
  .macro("auth", {
    detail: {
      security: [{ bearerAuth: [] }],
    },
    response: {
      401: "error",
    },
    resolve: async ({ bearer, jwt }) => {
      if (!bearer) throw UnauthorizedError;
      const claims = await jwt.verify(bearer);
      if (!claims) throw UnauthorizedError;
      const userId = parseInt(claims.sub);
      return { userId };
    },
  });
