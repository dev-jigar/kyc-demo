import { z } from "zod";

import {
  ApplicationInfoSdkV1DataModel,
  SubjectInfoSdkV1DataModel,
  ProductEventSdkV1DataModel,
  EReferenceTypeSdkV1,
  ESubjectTypeSdkV1,
  ReferenceSdkV1DataModel,
} from "./internal-model-data";

// Optional: Zod validation schema
const createProductSchema = z.object({
  userId: z.string().uuid(),
  application: z.object({ id: z.string() }),
  subject: z.object({
    subjectType: z.nativeEnum(ESubjectTypeSdkV1),
    references: z
      .array(
        z.object({
          type: z.nativeEnum(EReferenceTypeSdkV1),
          value: z.string(),
        }),
      )
      .nonempty(),
    orgId: z.string().uuid().optional(),
  }),
  data: z.object({
    eventTypeId: z.string(),
    appName: z.string(),
    deviceDate: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    meanSeaLevel: z.number().optional(),
    ipAddress: z.string(),
    status: z.string(),
    eventDate: z.string(),
  }),
  skipOrgVdtCheck: z.boolean().optional(),
});
