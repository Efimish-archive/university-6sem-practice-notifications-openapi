// Notification Test
// ru.krasabs.notificationtest

import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { z } from "zod";

const NotificationSchema = z
  .object({
    date: z.iso.datetime().meta({
      description: "Дата и время создания уведомления в формате ISO 8601",
      examples: ["2006-10-04T12:00:00.000Z"]
    }),
    title: z
      .string()
      .optional()
      .meta({
        description: "Заголовок уведомления (опционально)",
        examples: ["Сообщение от L"]
      }),
    icon: z
      .url()
      .optional()
      .meta({
        description: "Ссылка на иконку уведомления (опционально)",
        examples: ["https://example.com/icon.png"]
      }),
    priority: z
      .enum(["low", "medium", "high", "critical"])
      .default("medium")
      .meta({ description: "Приоритет важности уведомления" }),
    text: z.string().meta({
      description: "Текстовое содержание уведомления",
      examples: ["Приходи в офис в 6 вечера"]
    }),
  })
  .meta({ description: "Модель уведомления" });

const app = new Elysia()
  .use(cors())
  .use(
    openapi({
      path: "",
      documentation: {
        info: {
          title: "Уведомления API",
          version: "0.0.0",
          description: "REST API для push-уведомлений",
        },
        components: {
          securitySchemes: {
            bearer: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    }),
  )
  .model({
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
  })
  .post("/auth/login", "", {
    detail: {
      summary: "Вход в систему",
      description:
        "Аутентификация пользователя по логину и паролю с выдачей JWT-токена.",
    },
    parse: "application/json",
    body: z
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
      .meta({
        description: "Реквизиты для входа",
      }),
    response: {
      200: z
        .object({
          token: z.jwt().meta({
            description: "JWT-токен для аутентификации последующих запросов",
            examples: [
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30",
            ],
          }),
        })
        .meta({ description: "Сессия пользователя" }),
      400: "error",
    },
  })
  .get("/notifications", "", {
    detail: {
      security: [{ bearerAuth: [] }],
      summary: "Получить уведомления",
      description:
        "Запрос списка последних непрочитанных уведомлений текущего пользователя. (требует авторизации)",
    },
    response: {
      200: NotificationSchema.array().meta({
        description: "Список новых уведомлений",
      }),
      401: "error",
    },
  })
  .ws("/listen", {
    detail: {
      security: [{ bearerAuth: [] }],
      summary: "Подписка на уведомления (WebSocket)",
      description:
        "Постоянное соединение для получения новых уведомлений в реальном времени. (требует авторизации)",
    },
    response: NotificationSchema,
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
