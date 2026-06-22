import { SignJWT, jwtVerify, decodeJwt as joseDecode } from 'jose';

export type JwtPayload = Record<string, unknown>;

export interface SignJwtOptions {
  expiresIn?: string | number;
  audience?: string;
  issuer?: string;
}

export interface VerifyJwtOptions {
  audience?: string;
  issuer?: string;
}

function getSecretKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function signJwt(
  payload: JwtPayload,
  secret: string,
  options?: SignJwtOptions,
): Promise<string> {
  const jwt = new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt();

  if (options?.expiresIn) jwt.setExpirationTime(options.expiresIn);
  if (options?.audience) jwt.setAudience(options.audience);
  if (options?.issuer) jwt.setIssuer(options.issuer);

  return jwt.sign(getSecretKey(secret));
}

export async function verifyJwt(
  token: string,
  secret: string,
  options?: VerifyJwtOptions,
): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getSecretKey(secret), options);
  return payload as JwtPayload;
}

export function decodeJwt(token: string): JwtPayload {
  return joseDecode(token) as JwtPayload;
}

export async function createAccessToken(
  payload: JwtPayload,
  secret: string,
): Promise<string> {
  return signJwt(payload, secret, { expiresIn: '15m' });
}

export async function createRefreshToken(
  payload: JwtPayload,
  secret: string,
): Promise<string> {
  return signJwt(payload, secret, { expiresIn: '7d' });
}
