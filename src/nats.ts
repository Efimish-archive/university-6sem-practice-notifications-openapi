import { connect } from "@nats-io/transport-node";
import { env } from "@/env";
import { randomUUID } from "crypto";
import type {
  Notification,
  NatsNotification,
} from "@/notifications/notifications.model";

export const nc = await connect({
  servers: "127.0.0.1:4222",
  token: env.NATS_TOKEN,
});

const createFakeNotification = (): Notification => {
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

export const sendFakeNotification = async () => {
  const payload = {
    userId: 1,
    notification: createFakeNotification(),
  } satisfies NatsNotification;
  // await IS REQUIRED
  await nc.publish("notifications", JSON.stringify(payload));
};
