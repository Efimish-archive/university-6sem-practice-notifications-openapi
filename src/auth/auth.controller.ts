import { Elysia } from "elysia";
import { context } from "../context";
import { CredentialsSchema, TokenObjectSchema } from "./auth.model";
import { AuthService } from "./auth.service";

export const authController = new Elysia({ prefix: "auth" })
  .use(context)
  .derive(({ jwt }) => ({ authSerivce: new AuthService(jwt) }))
  .post(
    "login",
    ({ body, authSerivce }) => authSerivce.login(body.username, body.password),
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
// .post("/auth/setFirebaseToken", "", {
//   detail: {
//     security: [{ bearerAuth: [] }],
//     summary: "Установать Firebase-токен пользователя",
//     description:
//       "Установать Firebase-токен пользователя для последующего использования при отправки уведомлений сервером. (требует авторизации)",
//   },
//   body: z
//     .object({
//       firebaseToken: z.string().meta({
//         description: "Firebase-токен пользователя",
//         examples: [
//           "0000000000000000_00000:00000000000000000000-0000000000000000000000000000000000000000000000000000_000000000000000000000000000-00000000000000000",
//         ],
//       }),
//     })
//     .meta({ description: "Firebase-сессия пользователя" }),
//   response: {
//     204: z.null(),
//     401: "error",
//   },
// })
