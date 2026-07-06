import { Elysia } from "elysia";
import type { Notification } from "./notifications.model";
import { NatsNotificationSchema } from "./notifications.model";
import { connect } from "@nats-io/transport-node";
import { env } from "../env";

export class NotificationsService {
  private notifications = new Map<number, Notification[]>();

  async start() {
    const nc = await connect({
      servers: "127.0.0.1:4222",
      token: env.NATS_TOKEN,
    });

    nc.subscribe("notifications", {
      callback: (_err, msg) => {
        const data = NatsNotificationSchema.parse(msg.json());
        console.log(`New notification: ${JSON.stringify(data, null, 2)}`);
        this.addByUserId(data.userId, data.notification);
      },
    });
  }

  addByUserId(userId: number, notification: Notification) {
    const list = this.listByUserId(userId);
    list.unshift(notification);
    this.notifications.set(userId, list);
  }

  amountByUserId(userId: number) {
    return (this.notifications.get(userId) ?? []).length;
  }

  listByUserId(userId: number) {
    return (this.notifications.get(userId) ?? []).sort((a, b) =>
      b.date.localeCompare(a.date),
    );
  }

  readByUserIdAndIds(userId: number, ids: string[]) {
    this.notifications.set(
      userId,
      (this.notifications.get(userId) ?? []).filter(
        ({ id }) => !ids.includes(id),
      ),
    );
  }
}

export const notificationsService = new Elysia({
  name: "notifications.service",
}).decorate(() => {
  const notificationsService = new NotificationsService();
  notificationsService.start();
  return { notificationsService };
});
