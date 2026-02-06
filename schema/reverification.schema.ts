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
const recurringBaseSchema = baseSchema.extend({
  frequency: z.literal(ReverificationFrequency.Recurring),

  repeatOn: z.coerce
    .number("Repeat interval is required")
    .int("Repeat interval must be a whole number")
    .positive("Repeat interval must be greater than 0"),

  repeatOnUnit: z.nativeEnum(
    reverificationRepeatUnit,
    "Repeat unit is required",
  ),

  metadata: z.undefined(),
});

const recurringByOccurrenceSchema = recurringBaseSchema.extend({
  endsType: z.literal(endsTyp.occurrence),

  endOccurrence: z.coerce
    .number("Occurrence is required")
    .int("Occurrence must be a whole number")
    .min(2, "Occurrence must be greater than 1"),

  endDate: z.undefined(),
});

const recurringByDateSchema = recurringBaseSchema
  .extend({
    endsType: z.literal(endsTyp.date),

    endDate: z.coerce.date("Invalid date format"),

    endOccurrence: z.undefined(),
  })
  .refine((data) => data.endDate > new Date(data.startDate), {
    path: ["endDate"],
    message: "End date must be after start date",
  });

const recurringByNeverSchema = recurringBaseSchema.extend({
  endsType: z.literal(endsTyp.never),

  endDate: z.undefined(),
  endOccurrence: z.undefined(),
});

const recurringSchema = z.discriminatedUnion("endsType", [
  recurringByOccurrenceSchema,
  recurringByDateSchema,
  recurringByNeverSchema,
]);
/* ------------------------------------------------------------------ */
/* FINAL SCHEMA */
/* ------------------------------------------------------------------ */
export const reverificationSchema = z.discriminatedUnion("frequency", [
  oneTimeSchema,
  recurringSchema,
]);

export type ReverificationSchemaType = z.infer<typeof reverificationSchema>;
