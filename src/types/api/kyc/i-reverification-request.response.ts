import { IReverificationRequestOccurrenceResponse } from "./i-reverification-request-occurrence.response";
import { IReverificationRequestTinyResponse } from "./i-reverification-request-tiny.response";

export interface IReverificationRequestResponse extends IReverificationRequestTinyResponse {
  reverificationRequestOccurrences?: IReverificationRequestOccurrenceResponse[];
}
