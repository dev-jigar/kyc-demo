import { z } from "zod";

export const categoryStatusEnumSchema = z.enum(["NORMAL", "FIXED"]);

export const ChainBaseEventMetadataSchema = z.object({
  qrId: z.string().optional(),
  timezone: z.string().optional(),
  nftTokenId: z.string().optional(),
  description: z.string().optional(),
  immutableTime: z.string().optional(),
  nftMetadataUrl: z.string().optional(),
  nftSmartContractAddress: z.string().optional(),
  immutableTransactionHash: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  platform: z.string().optional(),
  categoryState: categoryStatusEnumSchema.optional(),
});

export const ChainAssetEventMetadataSchema =
  ChainBaseEventMetadataSchema.extend({
    assetTypeId: z.string().optional(),
    custFileReqId: z.string().optional(),
    custFileId: z.string().optional(),
  });
export type ChainAssetEventMetadataType = z.infer<
  typeof ChainAssetEventMetadataSchema
>;

export const WeatherDataSchema = z.object({
  AbsHumidity: z.number(),
  AirDensity: z.number(),
  AvgCorrectedWindDir: z.number(),
  AvgCorrectedWindSpeed: z.number(),
  AvgRelativeWindDir: z.number(),
  AvgRelativeWindSpeed: z.number(),
  CompassHeading: z.number(),
  CorrectedGustDirection: z.number(),
  CorrectedGustSpeed: z.number(),
  CorrectedWindDir: z.number(),
  CorrectedWindSpeed: z.number(),
  Dewpoint: z.number(),
  GPSHeading: z.string(),
  GPSLocation: z.string(),
  GPSSpeedOverGround: z.string(),
  GPSStatusError: z.boolean(),
  HeatIndex: z.number(),
  PositionOfTheSun: z.number(),
  PrecipIntensity: z.string(),
  RainPresent: z.boolean(),
  Pressure: z.number(),
  PressureAtSeaLevel: z.number(),
  PressureAtStation: z.number(),
  RelGustDir: z.number(),
  RelGustSpeed: z.number(),
  RelHumidity: z.number(),
  RelWindDir: z.number(),
  RelWindSpeed: z.number(),
  SensorStatusError: z.boolean(),
  SolarNoonTime: z.string(),
  SolarRadiation: z.string(),
  SunriseTime: z.string(),
  SunsetTime: z.string(),
  SunshineHours: z.number(),
  Temperature: z.number(),
  TotalPrecip: z.string(),
  TwilightAstronomical: z.string(),
  TwilightCivil: z.string(),
  TwilightNautical: z.string(),
  WetBulbTemperature: z.number(),
  WindChill: z.number(),
  WindSensorError: z.boolean(),
  XTilt: z.number(),
  YTilt: z.number(),
  ZOrientation: z.string(),
});
export type WeatherDataType = z.infer<typeof WeatherDataSchema>;

export const deviceTypeEnum = z.enum([
  "STATIONARY_KIOSK",
  "MOBILE_KIOSK",
  "TABLET_KIOSK",
  "PHONE",
  "TABLET",
]);

const GeolocationData = z.object({
  latitude: z.number(),
  longitude: z.number(),
  meanSeaLevel: z.number(),
});

export const DeviceDataSchema = z.object({
  deviceId: z.string(),
  deviceName: z.string().optional(),
  deviceType: deviceTypeEnum.optional(),
  geolocation: GeolocationData.nullish(),
  ipAddress: z.string().optional(),
  date: z.string().optional(),
  hardwareLevel: z.string().optional(),
});
export type DeviceDataSchemaType = z.infer<typeof DeviceDataSchema>;

// Enums mirrored from PWA for payload consistency
export const subjectTypeEnum = z.enum([
  "EMPLOYEE",
  "DRIVER",
  "USER",
  "ASSET_OWNER",
]);

export const referenceTypeEnum = z.enum([
  "PHONE",
  "DRIVERS_LICENSE",
  "EMPLOYEE_ID",
  "AUTH0_IDENTITY",
  "END_USER_ID",
  "ADMIN_USER_ID",
]);
export const SubjectDataReferenceItem = z.object({
  type: referenceTypeEnum,
  value: z.string(),
});
export const SubjectDataSchema = z.object({
  subjectType: subjectTypeEnum,
  references: SubjectDataReferenceItem.array(),
  orgId: z.string().optional(),
});

export const CreateAssetSchema = z.object({
  application: z.object({
    id: z.string(),
  }),
  userId: z.string(),
  deviceId: z.string(),
  recipientAddress: z.string(),
  platform: z.string(),
  geolocation: GeolocationData.nullish(),
  locationAccuracy: z.enum(["exact", "city", "state", "country"]).optional(),
  isMarketplaceEvent: z.boolean().optional(),
  docs: z
    .array(
      z.object({
        docId: z.string(),
        data: z.string(),
        docType: z.enum(["PHOTO", "DOCUMENT"]),
        classification: z.enum(["FACE", "DOCUMENT"]),
        name: z.string(),
        description: z.string(),
        isMain: z.boolean(),
      }),
    )
    .optional(),
  attachments: z
    .array(z.object({ id: z.string(), data: z.string() }))
    .optional(),
  data: z
    .object({
      date: z.string(),
      product: z.object({
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        category: z.string(),
        name: z.string(),
        isFavorite: z.boolean(),
        rekognitionSessionId: z.string().optional(),
        properties: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
              value: z.string(),
            }),
          )
          .optional(),
        metadata: ChainAssetEventMetadataSchema.optional(),
      }),
    })
    .optional(),
  weather: WeatherDataSchema.optional(),
  device: DeviceDataSchema.optional(),
  subject: SubjectDataSchema.optional(),
});
export type CreateAssetType = z.infer<typeof CreateAssetSchema>;

export const locationAccuracyEnum = z.enum([
  "exact",
  "city",
  "state",
  "country",
]);

// Attachment related enums used in uploads
export const attachmentClassificationEnum = z.enum([
  "ASSET_PHOTO",
  "ASSET_DOCUMENT",
  "QRCODE",
]);
export type AttachmentClassification = z.infer<
  typeof attachmentClassificationEnum
>;

export const marketplaceCategoryEnum = z.enum(["event", "product", "service"]);
export const MarketplaceCategory = z.object({
  id: marketplaceCategoryEnum,
  name: z.string(),
  createdAt: z.string(),
});
export type MarketplaceCategoryType = z.infer<typeof MarketplaceCategory>;

export const CategoryOption = z.object({
  label: z.string(),
  value: z.string(),
});
export type CategoryOptionType = z.infer<typeof CategoryOption>;

export const categoryDescriptions = z.enum(["event", "product", "service"]);
export const CategoryDescriptionsModifier = {
  event: "Event (Occasion, Gathering, Activity)",
  product: "Object (Physical or Digital Item, Product)",
  service: "Service  (Task, Work, Professional Service)",
} as const satisfies Record<z.infer<typeof categoryDescriptions>, string>;

export type DeviceInfoPayload = {
  deviceId: string;
  macAddress: string;
  model: string;
  os: string;
  name: string;
  fcmToken: string;
};

export const AssetPropertySchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.string(),
});

export const ChainAssetDataSchema = z.object({
  assetType: z.string().nullable(),
  assetCategory: z.string().nullable(),
  assetName: z.string(),
  isFavorite: z.boolean(),
  assetProperties: AssetPropertySchema.array().optional(),
  metadata: z
    .object({
      assetTypeId: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  locationAccuracy: z.enum(["exact", "city", "state", "country"]).optional(),
});

export const SubjectReferenceSchema = z.object({
  type: referenceTypeEnum,
  value: z.string(),
});

export const ChainAssetItemSchema = z.object({
  id: z.string(),
  eventType: z.string(),
  application: z.string(),
  assetType: z.string().nullable(),
  status: z.string(),
  subjectType: subjectTypeEnum,
  attachments: z.any().nullable(),
  eventDate: z.string(),
  data: ChainAssetDataSchema,
  orgId: z.string(),
  device: DeviceDataSchema,
  subjectReferences: SubjectReferenceSchema.array(),
});

export const ChainAssetListResponseSchema = z.object({
  items: ChainAssetItemSchema.array(),
});

// ---------------- Types ----------------
export type ChainAssetItemType = z.infer<typeof ChainAssetItemSchema>;
export type ChainAssetListResponseType = z.infer<
  typeof ChainAssetListResponseSchema
>;

export const itemDetailsSchema = z.object({
  category: z.string().min(1, { message: "Category is required" }),
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Name must not exceed 255 characters" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(500, { message: "Description must not exceed 500 characters" }),
  // tagsInput stored for UI but not required; tags array must have >= 1
  tagsInput: z.string().optional(),
  tags: z
    .array(z.string().min(1))
    .min(1, { message: "At least one tag is required" }),
  // keep other fields optional so whole form value matches your existing FormValues
  privacy: z.string().optional(),
  productId: z.string().optional(),
  faceId: z.string().optional(),
  mainPhotoIndex: z.number().optional(),
  draftId: z.string().optional(),
});

export type ItemDetailsSchema = z.infer<typeof itemDetailsSchema>;
