import { IConfigurationAttachmentResponse } from "./i-config-attachment.response";
import { IConfigurationTinyResponse } from "./i-config-tiny.response";
import { IGroupedAddOnResponse } from "./i-grouped-add-ons.response";

export interface IConfigurationPageItemResponse extends IConfigurationTinyResponse {
  groupedAddOns?: IGroupedAddOnResponse[];
  attachments?: IConfigurationAttachmentResponse[];
}
