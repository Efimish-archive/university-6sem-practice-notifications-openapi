import { z } from "zod";

const EnvSchema = z.object({
  JWT_SECRET: z.string(),
  NATS_TOKEN: z.string(),
});

export const env = EnvSchema.parse(process.env);
