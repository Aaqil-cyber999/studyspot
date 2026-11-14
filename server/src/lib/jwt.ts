import { sign, verify, type JwtPayload } from "jsonwebtoken";

export type TokenPayload = {
  userId: string;
  email: string;
  role: string;
};

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
}

export function signToken(payload: TokenPayload): string {
  return sign(
    payload,
    getSecret() as unknown as string,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" } as Parameters<typeof sign>[2]
  );
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = verify(
      token,
      getSecret() as unknown as string
    ) as JwtPayload & TokenPayload;
    return {
      userId: String(decoded.userId),
      email: String(decoded.email),
      role: String(decoded.role),
    };
  } catch {
    return null;
  }
}
