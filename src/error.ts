import { z } from "zod";

const ErrorMessageSchema = z.string().meta({
  description:
    "Понятное сообщение об ошибке, которое можно сразу показать пользователю в интерфейсе",
  examples: ["Неверные данные для входа"],
});

const ErrorCodeSchema = z
  .literal([400, 401])
  .meta({ description: "HTTP-статус ответа (код)" });

export const ErrorSchema = z
  .object({
    message: ErrorMessageSchema,
    code: ErrorCodeSchema,
  })
  .meta({ description: "Стандартный объект ошибки" });

type ErrorCode = z.infer<typeof ErrorCodeSchema>;

export class HttpError extends Error {
  public readonly status: ErrorCode;

  constructor(status: ErrorCode, message: string) {
    super(message);
    this.status = status;
  }

  toResponse() {
    return Response.json(
      {
        error: this.message,
        code: this.status,
      },
      {
        status: this.status,
      },
    );
  }
}
