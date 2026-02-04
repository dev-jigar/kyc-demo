import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const KYC_TOKEN_URL = process.env.KYC_TOKEN_URL;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    clientId?: string;
    clientSecret?: string;
    scope?: string;
  };

  if (!KYC_TOKEN_URL) {
    return NextResponse.json(
      { error: 'KYC_TOKEN_URL is not configured on the server' },
      { status: 500 },
    );
  }

  const clientId = body.clientId ?? process.env.KYC_CLIENT_ID;
  const clientSecret = body.clientSecret ?? process.env.KYC_CLIENT_SECRET;
  const scope = body.scope ?? process.env.KYC_SCOPE;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'clientId and clientSecret are required (either in body or env)' },
      { status: 400 },
    );
  }

  const form = new URLSearchParams();
  form.set('grant_type', 'client_credentials');
  if (scope) form.set('scope', scope);

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const resp = await axios.post(
      KYC_TOKEN_URL,
      form.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${basicAuth}`,
        },
      },
    );

    return NextResponse.json(resp.data);
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    const data = error?.response?.data ?? { message: String(error) };
    return NextResponse.json(data, { status });
  }
}



