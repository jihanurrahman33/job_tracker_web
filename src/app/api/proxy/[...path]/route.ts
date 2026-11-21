import { NextRequest, NextResponse } from 'next/server';

// The backend is fixed on the server. It is never taken from the request: a
// caller-chosen address would let anyone use this proxy to reach any host.
const BACKEND_URL = (
  process.env.NEXT_PUBLIC_DEFAULT_API_URL || 'https://job-tracker-server-nu.vercel.app'
).replace(/\/+$/, '');

// Only the API and its health checks may be reached through the proxy.
const ALLOWED_PATH = /^(api\/v1\/[A-Za-z0-9._~\-\/]*|health|healthz|ready)$/;

// Headers worth forwarding. Cookies and anything else the browser sends stay here.
const FORWARD_HEADERS = ['content-type', 'accept', 'authorization', 'x-auth-token', 'user-agent'];

/** The visitor's address as seen by this server's own platform edge. */
function visitorIp(req: NextRequest): string {
  const raw =
    req.headers.get('x-vercel-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for') ||
    '';
  return raw.split(',')[0].trim();
}

async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');

  if (!ALLOWED_PATH.test(path) || path.split('/').some((seg) => seg === '..' || seg === '.')) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Not found' } },
      { status: 404 },
    );
  }

  const targetUrl = `${BACKEND_URL}/${path}${req.nextUrl.search}`;

  const forwardHeaders: Record<string, string> = {};
  for (const name of FORWARD_HEADERS) {
    const value = req.headers.get(name);
    if (value) forwardHeaders[name] = value;
  }

  // Tell the API who is really calling. It only believes this when the shared
  // secret matches, so the visitor cannot set these headers themselves.
  const secret = process.env.BACKEND_PROXY_SECRET;
  const ip = visitorIp(req);
  if (secret && ip) {
    forwardHeaders['x-proxy-secret'] = secret;
    forwardHeaders['x-client-ip'] = ip;
  }

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

    const headers: Record<string, string> = { 'content-type': contentType };
    const retryAfter = response.headers.get('retry-after');
    if (retryAfter) headers['retry-after'] = retryAfter;
    const cacheControl = response.headers.get('cache-control');
    if (cacheControl) headers['cache-control'] = cacheControl;

    return new NextResponse(responseData, { status: response.status, headers });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'PROXY_NETWORK_ERROR',
          message: 'Failed to communicate with the server',
        },
      },
      { status: 502 },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
export const PUT = handler;
