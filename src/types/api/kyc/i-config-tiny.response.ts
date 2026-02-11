import { EConfigurationPaymentBy, EConfigurationRequestReason } from "./enums";
import { IPactveraSelectedTemplateResponse } from "./i-pactvera-selected-template.response";

export interface IConfigurationTinyResponse {
  id: string;
  title: string;
  description?: string;
  reasonForRequest: EConfigurationRequestReason;
  responsibleForPayment: EConfigurationPaymentBy;
  pactveraTemplates?: IPactveraSelectedTemplateResponse[];
  createdAt: Date;
  updatedAt: Date;
  totalPactveraCost?: number;
}
