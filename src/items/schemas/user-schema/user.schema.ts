/**
 * @file Zod schema and TypeScript type for user creation input.
 *
 * Validates name, email, and password fields on user registration
 * or profile update flows.
 */

import { z } from "zod";

/**
 * Zod schema for validating user creation input.
 *
 * Enforces:
 * - `name` — 2–100 characters
 * - `email` — valid email format
 * - `password` — minimum 8 characters
 *
 * @example
 * ```ts
 * const result = userSchema.safeParse({ name: "Alice", email: "a@b.com", password: "secret123" });
 * ```
 */
export const userSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

/** Inferred TypeScript type from the user schema. */
export type UserInput = z.infer<typeof userSchema>;
