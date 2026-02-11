import { EReverificationType } from "./enums";

export interface IAvailableReverificationResponse {
  id: string;
  name: string;
  description: string;
  type: EReverificationType;
  isRecurringEnabled: boolean;
  actionId: string;
}
