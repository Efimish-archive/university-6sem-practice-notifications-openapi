import type { Notification } from "./notifications.model";
import { randomUUID } from "crypto";

const createNotification = (): Notification => {
  const id = randomUUID();
  const now = new Date();
  return {
    id,
    date: now.toISOString(),
    priority: "high",
    icon: "http://192.168.10.20:3003/public/icon.png",
    title: `Уведомление ${id}`,
    body: `Время сейчас: ${now.toLocaleString("ru")}`,
  };
};

const createNotifications = (amount: number): Notification[] => {
  const notifications = [];
  while (notifications.length < amount)
    notifications.push(createNotification());
  return notifications;
};

export class NotificationsSerivce {
  private notifications = new Map([
    [1, createNotifications(5)],
    [2, createNotifications(3)],
    [3, createNotifications(1)],
  ]);

  amountByUserId(userId: number) {
    return (this.notifications.get(userId) ?? []).length;
  }

  listByUserId(userId: number) {
    return this.notifications.get(userId) ?? [];
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
