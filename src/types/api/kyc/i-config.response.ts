import { IConfigurationAttachmentResponse } from "./i-config-attachment.response";
import { IConfigurationTinyResponse } from "./i-config-tiny.response";
import { IGroupedAddOnResponse } from "./i-grouped-add-ons.response";

export interface IConfigurationResponse extends IConfigurationTinyResponse {
  attachments: IConfigurationAttachmentResponse[];
  groupedAddOns: IGroupedAddOnResponse[];
}
