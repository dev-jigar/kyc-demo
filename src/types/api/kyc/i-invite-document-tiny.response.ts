import { EDocumentStatus } from "./enums";

export interface IInviteDocumentTinyResponse {
  id: string;
  typeId: number;
  orgId: string;
  userId: string;
  inviteId: string;
  status: EDocumentStatus;
  createdAt: Date;
  updatedAt?: Date;
}
