import type { Notification } from "./notifications.model";
import { NatsNotificationSchema } from "./notifications.model";
import { connect } from "@nats-io/transport-node";
import { env } from "../env";

// import { randomUUID } from "crypto";

// const createNotification = (): Notification => {
//   const id = randomUUID();
//   const now = new Date();
//   return {
//     id,
//     date: now.toISOString(),
//     priority: "high",
//     icon: "http://192.168.10.20:3003/public/icon.png",
//     title: `Уведомление ${id}`,
//     body: `Время сейчас: ${now.toLocaleString("ru")}`,
//   };
// };

// const createNotifications = (amount: number): Notification[] => {
//   const notifications = [];
//   while (notifications.length < amount)
//     notifications.push(createNotification());
//   return notifications;
// };

export class NotificationsSerivce {
  private notifications = new Map<number, Notification[]>();

  async start() {
    const nc = await connect({
      servers: "127.0.0.1:4222",
      token: env.NATS_TOKEN,
    });

    nc.subscribe("notifications", {
      callback: (_err, msg) => {
        const { userId, notification } = NatsNotificationSchema.parse(
          msg.json(),
        );
        this.addByUserId(userId, notification);
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
