import { z } from 'zod';

export type ProductType = 'ageApp' | 'checkIn' | string;

export type AttributeValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[]
  | boolean[]
  | Record<string, unknown>
  | Record<string, unknown>[];

export const EDocumentType = z.enum([
  'LICENSE',
  'INVITE_DOCUMENT',
  'PRODUCT_IMAGE',
  'BIOMETRIC_IMAGE',
  'PACTVERA_PDF',
  'CORPORATE_DOCUMENT_PDF',
  'RULE_GROUP',
  'COORDINATES',
  'REFERENCE_OBJECT',
  'STATEMENT_FILES',
  'PASSPORT',
]);

export const IFieldTypes = z.enum([
  'INTEGER',
  'DATE',
  'DATETIME',
  'TIMESTAMP',
  'BOOLEAN',
  'JSON',
  'STRING',
  'ARRAY',
  'NUMBER',
  'TIME',
  'FILE',
  'ADDRESS',
  'REFERENCE',
  'SIGNATURE',
  'SIGNATURE_ARRAY',
  'BADGE',
  ...EDocumentType.options,
]);

export const ETagType = z.enum(['BADGE']);

export const MetadataField = z.object({
  relatedAttributeId: z.string().nullish(),
  type: ETagType.nullish(),
  label: z.object({
    falsy: z.unknown().nullish(),
    truthy: z.unknown().nullish(),
  }),
  value: z.unknown().nullish(),
  slug: z.string().nullish(),
});

export const ECollection = z.enum([
  'Album',
  'IVDT',
  'PVDT',
  'ORG_AUTHORITY_DOCUMENT_USER',
  'OFFICER_ATTESTATION_USER',
  'DOCUMENTS_ATTESTATION_USER',
  'AUTHORITY_ATTESTATION_USER',
  'SHAREHOLDER_AFFIRMATION_USER',
  'EMPLOYEE_LEDGER',
  'MEMBERSHIP_LEDGER',
  'PEP_CHECK',
  'CRIMINAL_BACKGROUND_CHECK',
  'USER',
  'PACTVERA_DOCUMENT_RECIPIENT',
  'PACTVERA_FORM_RECIPIENT',
  'WITNESS_VALIDATION_LEDGER',
  'CHECKIN_USER',
  'AGE_APP_USER',
  'SSN_VERIFICATION',
  'SEX_OFFENDER_REGISTRY',
  'OFAC_CHECK',
  'BANK_STATEMENTS',
  'BANK_ACCOUNT_VERIFICATION',
  'NON_PROFIT_ORGANIZATION_CHECK',
]);

export type ECollectionType = z.infer<typeof ECollection>;

export const LedgerPrefixMap: Partial<Record<ECollectionType, string>> = {
  MEMBERSHIP_LEDGER: 'membership_ledger',
  DOCUMENTS_ATTESTATION_USER: 'documentattestationvdt',
  OFFICER_ATTESTATION_USER: 'pv2vdt',
  SHAREHOLDER_AFFIRMATION_USER: 'shareholderaffirmationvdt',
  CHECKIN_USER: 'checkin_user',
  EMPLOYEE_LEDGER: 'employee_ledger',
  ORG_AUTHORITY_DOCUMENT_USER: 'orgauthorityvdt',
  PACTVERA_DOCUMENT_RECIPIENT: 'pactvera_document_recipient',
  AUTHORITY_ATTESTATION_USER: 'arp1vdt',
  PACTVERA_FORM_RECIPIENT: 'pactvera_form_recipient',
  CRIMINAL_BACKGROUND_CHECK: 'criminal_background_check',
  PEP_CHECK: 'pep_check',
  AGE_APP_USER: 'age_app_user',
  SSN_VERIFICATION: 'ssn_verification',
  USER: 'user',
  PVDT: 'pvdt',
  BANK_STATEMENTS: 'bank_statements',
  BANK_ACCOUNT_VERIFICATION: 'bank_account_verification',
  SEX_OFFENDER_REGISTRY: 'sex_offender_registry',
  OFAC_CHECK: 'ofac_check',
  WITNESS_VALIDATION_LEDGER: 'witness_validation_ledger',
  NON_PROFIT_ORGANIZATION_CHECK: 'non_profit_organization_check',
};

export interface AttributeItemModelType {
  type?: z.infer<typeof IFieldTypes>;
  label?: string;
  a_id?: string;
  value?: AttributeValue;
  slug?: string;
  ui_group?: string | null;
  metadata?: z.infer<typeof MetadataField>[];
  context?: string;
  attributes?: AttributeItemModelType[];
}

// Badge and metadata types for touch audit
export interface BadgeLabel {
  truthy?: string;
  falsy?: string;
}

export interface BadgeMetadata {
  type: 'BADGE';
  slug?: string;
  value?: boolean;
  label?: BadgeLabel;
}

export interface MetadataItem {
  type?: string;
  slug?: string;
  value?: unknown;
  label?: BadgeLabel | string;
  [key: string]: unknown;
}

export interface WhoSectionData {
  type: string;
  context: string;
  attributes: AttributeItemModelType[];
}

export interface PresenterData {
  who?: WhoSectionData[];
  what?: AttributeItemModelType[];
  when?: AttributeItemModelType[];
  where?: AttributeItemModelType[];
  qrCode?: {
    name: string;
    path: string;
    versionId: string;
  };
}

export interface LedgerAuditResponse {
  what?: AttributeItemModelType[];
  who?: WhoSectionData[];
  when?: AttributeItemModelType[];
  where?: AttributeItemModelType[];
  qrCode?: {
    name: string;
    path: string;
    versionId: string;
    url?: string;
  };
  [key: string]: unknown;
}

export interface Web3AuditResponse {
  version: string;
  regId: string;
  platform: string;
  immutableTime: string;
  nftTokenId: string;
  nftMetadataUrl: string;
  nftSmartContractAddress: string;
  immutableTransactionHash: string;
  walletAddress: string;
  qrId: string;
  blockNumber: number;
  eventId: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

// Hook parameter interfaces
export interface TouchAuditWebDataParams {
  transactionId?: string;
  productLine: string;
}

export interface TouchAuditReadLedgerParams {
  transactionId?: string;
  productLine: string;
  enablePostMintingAttributes?: boolean;
}

// PreSigned document interfaces
export interface PreSignedDocumentResponse {
  name: string;
  path: string;
  url: string;
}

export interface UseGetPreSignedDocumentParams {
  documentType: string;
  path?: string;
  productLine: 'AGE_APP_ORG' | 'CHECKIN_ORG' | string; // add more as needed
}

export const EAttributeShortType = z.enum([
  'IVDT',
  'OVDT',
  'PVDT',
  'EVDT',
  'SVDT',
  'AVDT',
  'DVDT',
  'PACTVDT',
  'ORG_AUTHORITY_DOCUMENT_ORG',
  'ORG_AUTHORITY_DOCUMENT_USER',
  'OFFICER_ATTESTATION_ORG',
  'OFFICER_ATTESTATION_USER',
  'DOCUMENTS_ATTESTATION_ORG',
  'DOCUMENTS_ATTESTATION_USER',
  'AUTHORITY_ATTESTATION_ORG',
  'AUTHORITY_ATTESTATION_USER',
  'SHAREHOLDER_AFFIRMATION_ORG',
  'SHAREHOLDER_AFFIRMATION_USER',
  'ORGAUTHORITYVDT',
  'SHAREHOLDERAFFIRMATIONVDT',
  'DOCUMENTATTESTATIONVDT',
  'PV2VDT',
  'ARP1VDT',
  'CDVDT',
  'CHECKIN_ORG',
  'CHECKIN_USER',
  'AGE_APP_ORG',
  'AGE_APP_USER',
  'PACTVERA_DOCUMENT_RECIPIENT',
  'PACTVERA_REJECT_DOCUMENT',
  'PACTVERA_REQUEST_DOCUMENT',
  'PACTVERA_FORM_RECIPIENT',
  'PACTVERA_REJECT_FORM',
  'PACTVERA_REQUEST_FORM',
  'PACTVERA_DOCUMENT_RECIPIENT',
  'PACTVERA_FORM_RECIPIENT',
  'EMPLOYEE_LEDGER',
  'MEMBERSHIP_LEDGER',
  'PEP_CHECK',
  'CRIMINAL_BACKGROUND_CHECK',
  'SSN_VERIFICATION',
  'USER',
  'BANK_ACCOUNT_VERIFICATION',
  'BANK_STATEMENTS',
  'SEX_OFFENDER_REGISTRY',
  'OFAC_CHECK',
]);

export const EVdtContractType = z.enum([
  'jectVDT',
  'ProductVDT',
  'EventVDT',
  'ServiceVDT',
  'DeviceVDT',
  'IVDT',
  'UserDeviceVDT',
  'UserObjectVDT',
  'UserServiceVDT',
  'UserOrganizationVDT',
  'OVDT',
  'ODVDT',
  'OIVDT',
  'OOVDT',
  'OSVDT',
  'WitnessVDT',
  'ObjectWitnessVDT',
  'ServiceWitnessVDT',
  'CustomerFileVDT',
  'ActionVDT',
  'DocumentVDT',
  'DataVDT',
  'PactveraVDT',
]);

export const isCoordinate = (
  attribute: AttributeItemModelType,
): attribute is AttributeItemModelType & {
  value: {
    latitude: number | null;
    longitude: number | null;
  };
} => attribute.type === 'COORDINATES' && attribute.value !== '';

// To get pre signed url for images/doc
export const presignedDocumentResponseSchema = z.array(
  z.object({
    type: EDocumentType,
    path: z.string(),
    url: z.string(),
  }),
);

// VDT payload
export const vdtPayload = z.object({
  entityId: z.string(),
  entityType: z.string().nullish(),
  vdtType: EVdtContractType,
});
export type VdtPayloadType = z.infer<typeof vdtPayload>;

export const MetaVdtModel = z.object({
  version: z.string().nullish(),
  regId: z.string().nullish(),
  platform: z.string().nullish(),
  immutableTime: z.string().nullish(),
  nftTokenId: z.string().nullish(),
  nftMetadataUrl: z.string().nullish(),
  nftSmartContractAddress: z.string().nullish(),
  immutableTransactionHash: z.string().nullish(),
  walletAddress: z.string().nullish(),
  qrId: z.string().nullish(),
  blockNumber: z.number().nullish(),
  eventId: z.string().nullish(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
});

export type MetaVdtModelType = z.infer<typeof MetaVdtModel>;
