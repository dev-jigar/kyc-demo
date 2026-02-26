export const TOKEN_URL = process.env.NEXT_TOKEN_URL;
export const API_BASE_URL = process.env.NEXT_API_BASE_URL;
export const CLIENT_ID = process.env.NEXT_CLIENT_ID;
export const CLIENT_SECRET = process.env.NEXT_CLIENT_SECRET;
export const DEFAULT_SCOPE = process.env.NEXT_SCOPE;
export const USERID = process.env.NEXT_PUBLIC_USERID;

if (!TOKEN_URL || !API_BASE_URL) {
  console.warn(
    "[KYC SDK] Missing TOKEN_URL or API_BASE_URL. Configure them in your .env.local.",
  );
}
