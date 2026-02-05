import { NextRequest, NextResponse } from 'next/server';
import { searchInvite, sendInvite } from '@/lib/kycApi';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';

  try {
    const resp = await searchInvite(q);
    return NextResponse.json(resp.data ?? resp);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const resp = await sendInvite(body);
    return NextResponse.json(resp.data ?? resp);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// Add this configuration
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Adjust as needed (e.g., '4mb', '50mb')
    },
  },
};
