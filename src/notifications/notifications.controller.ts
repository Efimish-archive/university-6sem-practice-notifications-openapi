import { Elysia } from "elysia";
import { context, UnauthorizedError } from "../context";
import {
  NotificationAmountSchema,
  NotificationIdArraySchema,
  NotificationArraySchema,
} from "./notifications.model";
import { NotificationsSerivce } from "./notifications.service";
import { TokenObjectSchema } from "../auth/auth.model";

export const notificationsController = new Elysia({ prefix: "notifications" })
  .use(context)
  .derive(async () => {
    const notificationsService = new NotificationsSerivce();
    await notificationsService.start();
    return { notificationsService };
  })
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
        200: NotificationArraySchema,
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
      body: NotificationIdArraySchema,
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
    query: TokenObjectSchema,
    response: NotificationArraySchema,
    // @ts-ignore
    async beforeHandle({ jwt, query }) {
      const claims = await jwt.verify(query.token);
      if (!claims) throw UnauthorizedError;
      const userId = parseInt(claims.sub);
      return { userId };
    },
    async open(ws) {
      for (let i = 0; i < 10; i++) {
        ws.send([]);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    },
  });
