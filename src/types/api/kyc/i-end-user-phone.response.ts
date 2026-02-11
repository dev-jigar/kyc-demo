export interface IEndUserPhoneResponse {
  id: string;
  phone: string;
  userId: string;
  isPrimary: boolean;
  isLocked: boolean;
  createdAt: Date;
}
