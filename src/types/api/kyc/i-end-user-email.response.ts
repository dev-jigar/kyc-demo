export interface IEndUserEmailResponse {
  id: string;
  userId: string;
  email: string;
  emailNormalized: string;
  isPrimary: boolean;
  createdAt: Date;
}
