import { ECollectionType } from "../enums";

export type Product = {
  id: string;
  userId: string;
  thumbnailPath?: string;
  pathUrl?: string;
  name: string;
  eventId?: string;
  orgId?: string;
  orgName?: string;
  entityId?: string;
  type: ECollectionType;
  tags?: string[];
  createdAt?: string; // ISO string from API
  isSystemGenerated?: boolean;
  itemsCount?: number;
};

export interface ProductDetails {
  id: string;
  deviceId: string;
  appName: string;
  deviceDate: string;
  subjectType: string;
  eventTypeId: string;
  createdBy: string;
  createdOrgId: string;
  latitude: number;
  longitude: number;
  meanSeaLevel: number;
  ipAddress: string;
  status: string;
  eventDate: string;
  createdAt: string;
  weather: string | null;
}

export type Pageable<T> = {
  items: T[];
  page: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
};
