import { Elysia } from "elysia";
import { context, UnauthorizedError } from "@/context";
import {
  NotificationAmountSchema,
  NotificationIdArraySchema,
  NotificationArraySchema,
  PaginationSchema,
} from "./notifications.model";
import { notificationsService } from "./notifications.service";
import { TokenObjectSchema } from "@/auth/auth.model";
import { sendFakeNotification } from "@/nats";

export const notificationsController = new Elysia({ prefix: "notifications" })
  .use(context)
  .use(notificationsService)
  .decorate({ notificationsService })
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
    ({ query, userId, notificationsService }) =>
      notificationsService.listByUserId(userId, query),
    {
      detail: {
        summary: "Получить новые уведомления",
        description:
          "Запрос списка последних непрочитанных уведомлений текущего пользователя. (требует авторизации)",
      },
      query: PaginationSchema,
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
    body: NotificationIdArraySchema,
    async open(ws) {
      const claims = await ws.data.jwt.verify(ws.data.query.token);
      if (!claims) throw UnauthorizedError;
      const userId = parseInt(claims.sub);

      ws.send(ws.data.notificationsService.listByUserId(userId));

      ws.data.notificationsService.addSubscriber(userId, (notification) => {
        ws.send([notification]);
      });
    },
    async message(ws, message) {
      const claims = await ws.data.jwt.verify(ws.data.query.token);
      if (!claims) throw UnauthorizedError;
      const userId = parseInt(claims.sub);

      ws.data.notificationsService.readByUserIdAndIds(userId, message);
    },
    async close(ws) {
      const claims = await ws.data.jwt.verify(ws.data.query.token);
      if (!claims) throw UnauthorizedError;
      const userId = parseInt(claims.sub);

      ws.data.notificationsService.removeSubscriber(userId);
    },
  })
  // TODO: remove
  .get(
    "fake",
    async () => {
      await sendFakeNotification();
      return null;
    },
    {
      detail: {
        summary: "Отправить уведомление пользовтелю 1 (тест)",
      },
      response: "nothing",
    },
  );
