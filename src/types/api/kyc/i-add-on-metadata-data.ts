import { EDurationMonth } from "./enums";
import { IPactveraData } from "./i-pactvera.data";

export interface IAddOnMetadataData {
  threshold?: number;
  pactvera?: IPactveraData;
  duration?: EDurationMonth;
  reasonForRequest?: string;
}
