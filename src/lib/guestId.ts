// src/lib/guestId.ts

const GUEST_ID_KEY = "polspoch_guest_id";

/**
 * Retrieves the existing guest ID from localStorage or creates a new one.
 */
export const getOrCreateGuestId = (): string => {
  if (globalThis.window === undefined) return "";

  let guestId = localStorage.getItem(GUEST_ID_KEY);

  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }

  return guestId;
};

/**
 * Clears the guest ID from localStorage.
 */
export const clearGuestId = (): void => {
  if (globalThis.window !== undefined) {
    localStorage.removeItem(GUEST_ID_KEY);
  }
};
