// Notification Test
// ru.krasabs.notificationtest

import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { staticPlugin } from "@elysiajs/static";
import { context } from "@/context";

import { authController } from "@/auth/auth.controller";
import { notificationsController } from "@/notifications/notifications.controller";

const app = new Elysia()
  .use(cors())
  .use(
    openapi({
      path: "",
      documentation: {
        info: {
          title: "Уведомления API",
          version: "0.0.0",
          description: "REST API для push-уведомлений",
        },
        components: {
          securitySchemes: {
            bearer: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    }),
  )
  .use(staticPlugin())
  .use(context)
  .use(authController)
  .use(notificationsController)
  .listen(3003);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
