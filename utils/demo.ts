export const DEMO_USER_EMAIL = "demo@ipa.wid.li";

export function isDemoUser(email: string | undefined | null): boolean {
  return email === DEMO_USER_EMAIL;
}
