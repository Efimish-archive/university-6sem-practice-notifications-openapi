# REST API для push-уведомлений

```bash
# Запустить сервер
bun start

# Запустить брокер NATS
nats-server -m 8222 -js --auth xxx

# Отправить новое уведомление в NATS
bun run scripts/send-notification.ts
```
