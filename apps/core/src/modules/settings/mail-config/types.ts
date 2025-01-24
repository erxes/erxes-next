import { z } from "zod";
import { mailServiceValidationSchema } from "./schema";

type MailServiceFormT = z.infer<typeof mailServiceValidationSchema>;

export {
  MailServiceFormT
}