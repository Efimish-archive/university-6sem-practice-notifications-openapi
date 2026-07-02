import { Elysia } from "elysia";
import { z } from "zod";
import { context } from "./context";
import {
  NotificationIdSchema,
  NotificationSchema,
  type Notification,
} from "./notifications/notifications.model";

import { randomUUID } from "crypto";
const notifications: Notification[] = [];
(async () => {
  while (true) {
    if (notifications.length >= 10) continue;
    const id = randomUUID();
    const now = new Date();
    notifications.push({
      id,
      date: now.toISOString(),
      priority: "high",
      icon: "http://192.168.10.20:3003/public/icon.png",
      title: `Уведомление ${id}`,
      body: `Время сейчас: ${now.toLocaleString("ru")}`,
    });
    await new Promise((resolve) => setTimeout(resolve, 30 * 1000));
  }
})();

export const notificationsTestController = new Elysia({
  prefix: "test/notifications",
})
  .use(context)
  .get("amount", () => notifications.length, {
    detail: {
      security: [{ bearerAuth: [] }],
      summary: "Получить количество новых уведомлений",
      description:
        "Запрос списка количества уведомлений текущего пользователя. (требует авторизации)",
    },
    response: {
      200: z.int().min(0).meta({ description: "Количество новых уведомлений" }),
      401: "error",
    },
  })
  .get("list", () => notifications, {
    detail: {
      security: [{ bearerAuth: [] }],
      summary: "Получить новые уведомления",
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
  .post(
    "read",
    ({ body }) => {
      notifications.splice(
        0,
        notifications.length,
        ...notifications.filter(
          (notification) => !body.includes(notification.id),
        ),
      );
    },
    {
      detail: {
        security: [{ bearerAuth: [] }],
        summary: "Пометить уведомления прочитанными",
        description:
          "Прочитать уведомления - удалить их из списка, чтобы при запросе их больше не было",
      },
      body: NotificationIdSchema.array().meta({
        description: "Список идентификаторов уведомлений",
      }),
      response: {
        204: z.null(),
        401: "error",
      },
    },
  )
  .ws("listen", {
    detail: {
      security: [{ bearerAuth: [] }],
      summary: "Подписка на уведомления (WebSocket)",
      description:
        "Постоянное соединение для получения новых уведомлений в реальном времени. (требует авторизации)",
    },
    response: NotificationSchema,
  });
