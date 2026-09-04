import type { Access, FieldAccess } from "payload";

export const anyone: Access = () => true;

export const authenticated: Access = ({ req: { user } }) => Boolean(user);

export const adminOnly: Access = ({ req: { user } }) =>
  Boolean(user && (user as { role?: string }).role === "admin");

export const adminField: FieldAccess = ({ req: { user } }) =>
  Boolean(user && (user as { role?: string }).role === "admin");

export function isAdmin(user: { role?: string } | null | undefined): boolean {
  return user?.role === "admin";
}
