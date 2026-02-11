import { ILedgerAddOnResultResponse } from "./i-ledger-add-on-result.response";
import { ILedgerDataTinyResponse } from "./i-ledger-data-tiny.response";

export interface ILedgerDataResponse extends ILedgerDataTinyResponse {
  addOns?: ILedgerAddOnResultResponse[];
}
