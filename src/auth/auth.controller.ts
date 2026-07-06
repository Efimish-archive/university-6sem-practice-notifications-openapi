import { Elysia } from "elysia";
import { CredentialsSchema, TokenObjectSchema } from "./auth.model";
import { authService } from "./auth.service";

export const authController = new Elysia({ prefix: "auth" })
  .use(authService)
  .post(
    "login",
    ({ body, authService }) => authService.login(body.username, body.password),
    {
      detail: {
        summary: "Вход в систему",
        description:
          "Аутентификация пользователя по логину и паролю с выдачей JWT-токена.",
      },
      parse: "application/json",
      body: CredentialsSchema,
      response: {
        200: TokenObjectSchema,
        400: "error",
      },
    },
  );
