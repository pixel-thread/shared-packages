import { ConflictError, UnauthorizedError } from '@items/errors/http-errors/http-errors';
import { prisma } from '@items/prisma/client';
import { hashPassword, comparePassword } from '../lib/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokens';
import type { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });

  if (existing) {
    throw new ConflictError('A user with this email already exists');
  }

  const passwordHash = hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      roles: ['USER'],
    },
  });

  const accessToken = await generateAccessToken({ sub: user.id, roles: user.roles });
  const refreshToken = await generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
    },
    tokens: { accessToken, refreshToken },
  };
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const valid = comparePassword(data.password, user.passwordHash);

  if (!valid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const accessToken = await generateAccessToken({ sub: user.id, roles: user.roles });
  const refreshToken = await generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
    },
    tokens: { accessToken, refreshToken },
  };
}

export async function refresh(token: string): Promise<AuthResponse> {
  const sub = await verifyRefreshToken(token);
  const user = await prisma.user.findUniqueOrThrow({ where: { id: sub } });

  const accessToken = await generateAccessToken({ sub: user.id, roles: user.roles });
  const newRefreshToken = await generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
    },
    tokens: { accessToken, refreshToken: newRefreshToken },
  };
}
