import { EConfigurationAddOnAssigneeType } from "./enums";
import { IConfigurationAddOnResponse } from "./i-config-add-on.response";

export interface IGroupedAddOnResponse {
  type: EConfigurationAddOnAssigneeType;
  addOns?: IConfigurationAddOnResponse[];
}
