import { SignJWT, jwtVerify } from 'jose';

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET ?? '');
const REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET ?? '');

export function generateAccessToken(payload: { sub: string; roles: string[] }): Promise<string> {
  return new SignJWT({ roles: payload.roles })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(ACCESS_SECRET);
}

export function generateRefreshToken(sub: string): Promise<string> {
  return new SignJWT({ type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(token: string): Promise<{ sub: string; roles: string[] }> {
  const { payload } = await jwtVerify(token, ACCESS_SECRET);

  if (!payload.sub) {
    throw new Error('Invalid token: missing subject');
  }

  return { sub: payload.sub as string, roles: (payload.roles as string[]) ?? [] };
}

export async function verifyRefreshToken(token: string): Promise<string> {
  const { payload } = await jwtVerify(token, REFRESH_SECRET);

  if (!payload.sub) {
    throw new Error('Invalid refresh token: missing subject');
  }

  return payload.sub as string;
}
