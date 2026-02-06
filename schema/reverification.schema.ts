import {
  ReverificationFrequency,
  reverificationRepeatUnit,
  endsTyp,
} from "@/components/reverification/types";
import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Base fields (always present) */
/* ------------------------------------------------------------------ */
const baseSchema = z.object({
  reverificationId: z.string().trim().min(1, "Verification type is required"),

  startDate: z
    .string()
    .trim()
    .min(1, "Start date is required")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .refine((val) => {
      const start = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return start >= today;
    }, "Start date cannot be in the past"),

  daysBeforeDueDate: z.coerce
    .number("Must be a number")
    .int("Must be a whole number")
    .min(0, "Must be 0 or greater")
    .optional(),
});

/* ------------------------------------------------------------------ */
/* ONE TIME */
/* ------------------------------------------------------------------ */
const oneTimeSchema = baseSchema.extend({
  frequency: z.literal(ReverificationFrequency.OneTime),

  repeatOn: z.undefined(),
  repeatOnUnit: z.undefined(),

  endsType: z.undefined(),
  endOccurrence: z.undefined(),
  endDate: z.undefined(),

  metadata: z
    .object({
      duration: z
        .string("Duration is required")
        .trim()
        .min(1, "Duration is required"),
      reasonForRequest: z.string().trim().optional(),
    })
    .optional(),
});

/* ------------------------------------------------------------------ */
/* RECURRING */
/* ------------------------------------------------------------------ */
const recurringSchema = baseSchema
  .extend({
    frequency: z.literal(ReverificationFrequency.Recurring),

    repeatOn: z
      .string()
      .trim()
      .min(1, "Repeat interval is required")
      .regex(/^\d+$/, "Repeat interval must be a valid number"),

    repeatOnUnit: z.nativeEnum(
      reverificationRepeatUnit,
      "Repeat unit is required",
    ),

    endsType: z.nativeEnum(endsTyp, "Ends type is required"),

    endOccurrence: z.string().trim().default(""),
    endDate: z.string().trim().default(""),

    metadata: z.undefined(),
  })
  .superRefine((data, ctx) => {
    if (data.endsType === endsTyp.occurrence) {
      if (!data.endOccurrence) {
        ctx.addIssue({
          path: ["endOccurrence"],
          message: "Occurrence is required",
          code: z.ZodIssueCode.custom,
        });
      } else if (!/^\d+$/.test(data.endOccurrence)) {
        ctx.addIssue({
          path: ["endOccurrence"],
          message: "Must be a valid number",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (data.endsType === endsTyp.date) {
      if (!data.endDate) {
        ctx.addIssue({
          path: ["endDate"],
          message: "End date is required",
          code: z.ZodIssueCode.custom,
        });
      } else if (isNaN(Date.parse(data.endDate))) {
        ctx.addIssue({
          path: ["endDate"],
          message: "Invalid date format",
          code: z.ZodIssueCode.custom,
        });
      } else if (new Date(data.endDate) <= new Date(data.startDate)) {
        ctx.addIssue({
          path: ["endDate"],
          message: "End date must be after start date",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

/* ------------------------------------------------------------------ */
/* FINAL SCHEMA */
/* ------------------------------------------------------------------ */
export const reverificationSchema = z.discriminatedUnion("frequency", [
  oneTimeSchema,
  recurringSchema,
]);

export type ReverificationSchemaType = z.infer<typeof reverificationSchema>;
