import { z } from "zod";

export const CredentialsSchema = z
  .object({
    username: z.string().meta({
      description: "Имя пользователя",
      examples: ["Kira"],
    }),
    password: z.string().meta({
      description: "Пароль пользователя",
      examples: ["12345678"],
    }),
  })
  .meta({ description: "Реквизиты для входа" });

export const TokenObjectSchema = z
  .object({
    token: z.jwt().meta({
      description: "JWT-токен для аутентификации последующих запросов",
      examples: [
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30",
      ],
    }),
  })
  .meta({ description: "Сессия пользователя" });
