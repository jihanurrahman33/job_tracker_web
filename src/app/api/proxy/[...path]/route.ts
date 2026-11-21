import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_SERVER_URL = process.env.NEXT_PUBLIC_DEFAULT_API_URL || 'https://job-tracker-server-nu.vercel.app';

async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  
  // Determine target backend server URL from custom header or fallback
  const backendUrl = req.headers.get('x-backend-url') || DEFAULT_SERVER_URL;
  const cleanBase = backendUrl.replace(/\/+$/, '');
  
  // Construct search query
  const search = req.nextUrl.search;
  const targetUrl = `${cleanBase}/${path}${search}`;

  // Forward incoming headers (except host)
  const forwardHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower !== 'host' && lower !== 'content-length' && lower !== 'x-backend-url') {
      forwardHeaders[key] = value;
    }
  });

  // Extract body if method has body
  let body: BodyInit | undefined = undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      const text = await req.text();
      if (text) {
        body = text;
      }
    } catch {
      // No body
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body,
      cache: 'no-store',
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const contentType = response.headers.get('content-type') || 'application/json';
    const responseData = await response.text();

    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'content-type': contentType,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'PROXY_NETWORK_ERROR',
          message: error.message || 'Failed to communicate with backend server',
        },
      },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
export const PUT = handler;
export const OPTIONS = async () => {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token, x-backend-url',
    },
  });
};

