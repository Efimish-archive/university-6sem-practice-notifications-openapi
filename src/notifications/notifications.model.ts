import { z } from "zod";

export const NotificationIdSchema = z.guid().meta({
  description: "Уникальный идентификатор уведомления",
  examples: ["123e4567-e89b-12d3-a456-426614174000"],
});

export const NotificationIdArraySchema = NotificationIdSchema.array().meta({
  description: "Список идентификаторов уведомлений",
});

export const NotificationSchema = z
  .object({
    id: NotificationIdSchema,
    date: z.iso.datetime().meta({
      description: "Дата и время создания уведомления в формате ISO 8601",
      examples: ["2006-10-04T12:00:00.000Z"],
    }),
    title: z
      .string()
      .optional()
      .meta({
        description: "Заголовок уведомления (опционально)",
        examples: ["Сообщение от L"],
      }),
    icon: z
      .url()
      .optional()
      .meta({
        description: "Ссылка на иконку уведомления (опционально)",
        examples: ["https://example.com/icon.png"],
      }),
    priority: z
      .enum(["low", "medium", "high", "critical"])
      .default("medium")
      .meta({ description: "Приоритет важности уведомления" }),
    body: z.string().meta({
      description: "Текстовое содержание уведомления",
      examples: ["Приходи в офис в 6 вечера"],
    }),
  })
  .meta({ description: "Модель уведомления" });

export const NotificationArraySchema = NotificationSchema.array().meta({
  description: "Список новых уведомлений",
});

export const NotificationAmountSchema = z
  .int()
  .min(0)
  .meta({ description: "Количество новых уведомлений" });

export type Notification = z.infer<typeof NotificationSchema>;
