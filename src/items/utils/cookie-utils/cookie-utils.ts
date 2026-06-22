export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
  domain?: string;
  expires?: Date;
  maxAge?: number;
}

export function serializeCookie(
  name: string,
  value: string,
  options?: CookieOptions,
): string {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

  if (options?.httpOnly) parts.push('HttpOnly');
  if (options?.secure) parts.push('Secure');
  if (options?.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options?.path) parts.push(`Path=${options.path}`);
  if (options?.domain) parts.push(`Domain=${options.domain}`);
  if (options?.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  if (options?.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);

  return parts.join('; ');
}

export function setCookie(
  name: string,
  value: string,
  options?: CookieOptions,
): string {
  const defaults: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  };
  return serializeCookie(name, value, { ...defaults, ...options });
}

export function clearCookie(name: string, options?: CookieOptions): string {
  return serializeCookie(name, '', {
    ...options,
    expires: new Date(0),
  });
}

export function parseCookies(header: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  const items = header.split(';');
  for (const item of items) {
    const idx = item.indexOf('=');
    if (idx === -1) continue;
    const key = decodeURIComponent(item.substring(0, idx).trim());
    const value = decodeURIComponent(item.substring(idx + 1).trim());
    if (key) cookies[key] = value;
  }
  return cookies;
}
