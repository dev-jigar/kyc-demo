import { z } from "zod";

// ── Constants (mirror backend) ─────────────────────────────────────────────
const EMAIL_MAX_LEN = 255;
const FIRST_NAME_MAX_LEN = 100;
const LAST_NAME_MAX_LEN = 100;
const PHONE_MAX_LEN = 20;

// ── Enums (mirror EOnboardingAddonType / EDurationMonth) ──────────────────
export const EOnboardingAddonType = z.enum([
  "PEP_CHECK",
  "SSN_VERIFICATION",
  "CRIMINAL_BACKGROUND_CHECK",
  "BANK_ACCOUNT_VERIFICATION",
  "BANK_STATEMENTS",
]);

export const EDurationMonth = z.enum([
  "lastMonth",
  "pastTwoMonths",
  "pastThreeMonths",
  "pastSixMonths",
  "lastFiveYears",
]);

// ── Sub-schemas ────────────────────────────────────────────────────────────

export const onBoardingAddonMetadataSchema = z.object({
  duration: EDurationMonth.optional(),
  reasonForRequest: z.string().trim().optional(),
});

export const inviteAddonDataSchema = z.object({
  addonType: EOnboardingAddonType,
  metadata: onBoardingAddonMetadataSchema.optional(),
});

export const attachmentRequestSchema = z.object({
  name: z.string().trim().min(1, "Attachment name is required"),
  // base64 string – presence-only validation on the frontend
  data: z.string().optional(),
});

// ── Main form schema ───────────────────────────────────────────────────────

export const addCustomerSchema = z.object({
  // email is required on the backend (@IsNotEmpty + @IsEmail)
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(EMAIL_MAX_LEN, `Email must be at most ${EMAIL_MAX_LEN} characters`),

  firstName: z
    .string()
    .trim()
    .max(
      FIRST_NAME_MAX_LEN,
      `First name must be at most ${FIRST_NAME_MAX_LEN} characters`,
    )
    .optional()
    .or(z.literal("")),

  lastName: z
    .string()
    .trim()
    .max(
      LAST_NAME_MAX_LEN,
      `Last name must be at most ${LAST_NAME_MAX_LEN} characters`,
    )
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .max(PHONE_MAX_LEN, `Phone must be at most ${PHONE_MAX_LEN} characters`)
    .optional()
    .or(z.literal("")),

  message: z.string().trim().optional().or(z.literal("")),
});

// ── Inferred types ─────────────────────────────────────────────────────────

export type AddCustomerFormValues = z.infer<typeof addCustomerSchema>;
export type InviteAddonData = z.infer<typeof inviteAddonDataSchema>;
export type AttachmentRequest = z.infer<typeof attachmentRequestSchema>;
export type OnBoardingAddonMetadata = z.infer<
  typeof onBoardingAddonMetadataSchema
>;
