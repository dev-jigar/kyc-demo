import { IAttachmentData } from "./i-attachment-data.model";
import { IInviteDocumentTinyResponse } from "./i-invite-document-tiny.response";

export interface IInviteDocumentResponse extends IInviteDocumentTinyResponse {
  attachments: IAttachmentData[];
}
