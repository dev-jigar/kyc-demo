import { IMetadataResponse } from "./i-metadata.response";

export interface IApiSuccessResponse<T> {
  status: number;
  success: true;
  message: string;
  metadata: IMetadataResponse;
  data: T;
}
