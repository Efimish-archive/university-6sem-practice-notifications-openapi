import type {
  Notification,
  NatsNotification,
} from "../src/notifications/notifications.model";
import { randomUUID } from "crypto";
import { connect } from "@nats-io/transport-node";
import { env } from "../src/env";

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

const nc = await connect({
  servers: "127.0.0.1:4222",
  token: env.NATS_TOKEN,
});

const userId = 1;
const notification = createNotification();
const payload = { userId, notification } satisfies NatsNotification;

// await IS REQUIRED
await nc.publish("notifications", JSON.stringify(payload));
console.log(`Sent notification: ${JSON.stringify(payload, null, 2)}`);

await nc.close();
