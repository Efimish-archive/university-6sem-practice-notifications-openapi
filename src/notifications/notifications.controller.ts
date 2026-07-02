import { Elysia } from "elysia";
import { context } from "../context";
import {
  NotificationIdSchema,
  NotificationSchema,
  NotificationAmountSchema,
} from "./notifications.model";

export const notificationsController = new Elysia({ prefix: "notifications" })
  .use(context)
  .get("amount", () => 0, {
    detail: {
      security: [{ bearerAuth: [] }],
      summary: "Получить количество новых уведомлений",
      description:
        "Запрос списка количества уведомлений текущего пользователя. (требует авторизации)",
    },
    response: {
      200: NotificationAmountSchema,
      401: "error",
    },
  })
  .get("list", () => [], {
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
  .post("read", () => {}, {
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
      204: "nothing",
      401: "error",
    },
  })
  .ws("listen", {
    detail: {
      security: [{ bearerAuth: [] }],
      summary: "Подписка на уведомления (WebSocket)",
      description:
        "Постоянное соединение для получения новых уведомлений в реальном времени. (требует авторизации)",
    },
    response: NotificationSchema,
  });
