import "server-only";

import { createHmac, createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "driveauto_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signSession(expiresAt: number) {
  const password = getAdminPassword();

  if (!password) {
    return "";
  }

  return createHmac("sha256", password).update(String(expiresAt)).digest("hex");
}

function createSessionValue() {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const signature = signSession(expiresAt);

  return `${expiresAt}.${signature}`;
}

function verifySessionValue(value: string | undefined) {
  if (!value || !getAdminPassword()) {
    return false;
  }

  const [rawExpiresAt, signature] = value.split(".");
  const expiresAt = Number(rawExpiresAt);

  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt || !signature) {
    return false;
  }

  const expectedSignature = signSession(expiresAt);

  return safeCompare(signature, expectedSignature);
}

export function verifyAdminPassword(password: string) {
  const configuredPassword = getAdminPassword();

  if (!configuredPassword) {
    return false;
  }

  return safeCompare(hashValue(password), hashValue(configuredPassword));
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);

  return verifySessionValue(session?.value);
}

export async function setAdminSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: createSessionValue(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/admin",
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/admin",
  });
}
