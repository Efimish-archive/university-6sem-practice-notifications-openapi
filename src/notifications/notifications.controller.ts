import { Elysia } from "elysia";
import { context } from "../context";
import {
  NotificationIdSchema,
  NotificationSchema,
  NotificationAmountSchema,
} from "./notifications.model";
import { NotificationsSerivce } from "./notifications.service";

export const notificationsController = new Elysia({ prefix: "notifications" })
  .use(context)
  .decorate({ notificationsService: new NotificationsSerivce() })
  .get(
    "amount",
    ({ userId, notificationsService }) =>
      notificationsService.amountByUserId(userId),
    {
      detail: {
        summary: "Получить количество новых уведомлений",
        description:
          "Запрос списка количества уведомлений текущего пользователя. (требует авторизации)",
      },
      response: {
        200: NotificationAmountSchema,
      },
      auth: true,
    },
  )
  .get(
    "list",
    ({ userId, notificationsService }) =>
      notificationsService.listByUserId(userId),
    {
      detail: {
        summary: "Получить новые уведомления",
        description:
          "Запрос списка последних непрочитанных уведомлений текущего пользователя. (требует авторизации)",
      },
      response: {
        200: NotificationSchema.array().meta({
          description: "Список новых уведомлений",
        }),
      },
      auth: true,
    },
  )
  .post(
    "read",
    ({ userId, body, notificationsService }) =>
      notificationsService.readByUserIdAndIds(userId, body),
    {
      detail: {
        summary: "Пометить уведомления прочитанными",
        description:
          "Прочитать уведомления - удалить их из списка, чтобы при запросе их больше не было",
      },
      body: NotificationIdSchema.array().meta({
        description: "Список идентификаторов уведомлений",
      }),
      response: {
        204: "nothing",
      },
      auth: true,
    },
  )
  .ws("listen", {
    detail: {
      summary: "Подписка на уведомления (WebSocket)",
      description:
        "Постоянное соединение для получения новых уведомлений в реальном времени. (требует авторизации)",
    },
    response: NotificationSchema,
  });
