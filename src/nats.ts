import { randomUUID } from "crypto";
import { connect } from "@nats-io/transport-node";
import { jetstream, jetstreamManager } from "@nats-io/jetstream";
import { env } from "@/env";
import {
  NotificationSchema,
  type Notification,
} from "@/notifications/notifications.model";

const STREAM_NAME = "notifications";

const nc = await connect({
  servers: "127.0.0.1:4222",
  token: env.NATS_TOKEN,
});

const js = jetstream(nc);
const jsm = await jetstreamManager(nc);

const createStream = async () => {
  try {
    const stream = await jsm.streams.info(STREAM_NAME);
    console.log(`Stream "${STREAM_NAME}" already exists.`);
    return stream;
  } catch {
    const stream = await jsm.streams.add({
      name: STREAM_NAME,
      subjects: [`${STREAM_NAME}.*`],
      storage: "file",
      retention: "workqueue",
    });
    console.log(`Created stream "${STREAM_NAME}".`);
    return stream;
  }
};
await createStream();

const createConsumerInfo = async (userId: number) => {
  const consumerName = `${STREAM_NAME}-${userId}`;
  try {
    const consumer = await jsm.consumers.info(STREAM_NAME, consumerName);
    console.log(`Stream "${consumerName}" already exists.`);
    return consumer;
  } catch {
    const consumer = await jsm.consumers.add(STREAM_NAME, {
      name: consumerName,
      filter_subject: `${STREAM_NAME}.${userId}`,
      ack_policy: "explicit",
      ack_wait: 30_000_000_000,
      max_deliver: 3,
    });
    console.log(`Created consumer "${consumerName}".`);
    return consumer;
  }
};

export const createConsumer = async (userId: number) => {
  const consumerInfo = await createConsumerInfo(userId);
  return js.consumers.get(STREAM_NAME, consumerInfo.name);
};

// send + recieve

export const sendNotification = async (
  userId: number,
  notification: Notification,
): Promise<void> => {
  await js.publish(`${STREAM_NAME}.${userId}`, JSON.stringify(notification));
  console.log(`Notification sent: ${STREAM_NAME}.${userId}`);
};

export const getSubjectMessageCount = async (
  userId: number,
): Promise<number> => {
  const subject = `${STREAM_NAME}.${userId}`;

  // Запрашиваем информацию о стриме, явно отфильтрованную по нашему сабжекту
  const streamInfo = await jsm.streams.info(STREAM_NAME, {
    subjects_filter: subject,
  });

  // NATS возвращает объект subjects, где ключ — это сабжект, а значение — кол-во сообщений
  const subjectsMap = streamInfo.state.subjects;

  if (subjectsMap && subject in subjectsMap) {
    return subjectsMap[subject];
  }

  return 0; // Если сообщений для этого юзера нет вообще
};

export const readNotifications = async (
  userId: number,
  limit: number,
): Promise<Notification[]> => {
  const consumer = await createConsumer(userId);
  const messages = await consumer.fetch({ max_messages: limit, expires: 1000 });
  const notifications: Notification[] = [];

  for await (const m of messages) {
    try {
      const notification = NotificationSchema.parse(m.json());
      notifications.push(notification);
    } catch {
      m.nak();
    }
  }

  return notifications;
};

export const subscribe = async (userId: number) => {
  //
};

//

const a = (() => {}) as (() => {}) | undefined;
a?.();

// fake

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

export const sendFakeNotification = async (userId: number): Promise<void> => {
  await sendNotification(userId, createFakeNotification());
};
