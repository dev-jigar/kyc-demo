import { EConfigurationAddOn, EConfigurationAddOnAssigneeType } from "./enums";
import { IAddOnMetadataData } from "./i-add-on-metadata-data";

export interface IConfigurationAddOnResponse {
  id: string;
  addOn: EConfigurationAddOn;
  type: EConfigurationAddOnAssigneeType;
  range?: string;
  metadata?: IAddOnMetadataData;
}
