import { Elysia } from "elysia";
import type { Notification, Pagination } from "./notifications.model";
import { NatsNotificationSchema } from "./notifications.model";
import { readNotifications, getSubjectMessageCount } from "@/nats";

export class NotificationsService {
  // private notifications = new Map<number, Notification[]>();
  // private subscribers = new Map<number, (notification: Notification) => void>();

  constructor() {
    // nc.subscribe("notifications", {
    //   callback: (_err, msg) => {
    //     const data = NatsNotificationSchema.parse(msg.json());
    //     console.log(`New notification: ${JSON.stringify(data, null, 2)}`);

    //     this.subscribers.get(data.userId)?.(data.notification);
    //     this.addByUserId(data.userId, data.notification);
    //   },
    // });
  }

  addSubscriber(
    userId: number,
    callback: (notification: Notification) => void,
  ) {
    // this.subscribers.set(userId, callback);
  }

  removeSubscriber(userId: number) {
    // this.subscribers.delete(userId);
  }

  // addByUserId(userId: number, notification: Notification) {
  //   const list = this.listByUserId(userId);
  //   list.unshift(notification);
  //   this.notifications.set(userId, list);
  // }

  async amountByUserId(userId: number) {
    return getSubjectMessageCount(userId);
  }

  async listByUserId(userId: number, limit = 20) {
    return readNotifications(userId, limit);
  }

  readByUserIdAndIds(userId: number, ids: string[]) {
    // this.notifications.set(
    //   userId,
    //   this.notifications
    //     .getOrInsert(userId, [])
    //     .filter(({ id }) => !ids.includes(id)),
    // );
  }
}

export const notificationsService = new Elysia({
  name: "notifications.service",
}).decorate(() => {
  const notificationsService = new NotificationsService();
  return { notificationsService };
});
