import { EDurationMonth } from "./enums";

export interface IReverificationRequestMetadata {
  duration?: EDurationMonth;
  reasonForRequest?: string;
}
