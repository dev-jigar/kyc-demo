import { IMetadataResponse } from "./i-metadata.response";

export interface IApiErrorResponse {
  status: number;
  success: false;
  message: string;
  errorCode: string;
  metadata: IMetadataResponse;
}
