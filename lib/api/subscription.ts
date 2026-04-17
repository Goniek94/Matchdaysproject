import apiClient from "./client";

export interface UpgradeResult {
  subscriptionTier: string;
  subscriptionExpiry: string | null;
}

/**
 * Step 1 — Request a signed payment-intent token from the backend.
 * The token is bound to the authenticated user, tier, and months.
 * It expires after 10 minutes.
 */
export async function initiateSubscription(
  tier: string,
  months: number,
): Promise<{ paymentToken: string; expiresIn: number }> {
  const res = await apiClient.post<{
    success: boolean;
    paymentToken: string;
    expiresIn: number;
  }>("/users/subscription/initiate", { tier, months });
  return res.data;
}

/**
 * Step 2 — Confirm the upgrade using the payment-intent token.
 * Without a valid token the backend rejects the request.
 */
export async function confirmSubscription(
  paymentToken: string,
): Promise<{ success: boolean; data: UpgradeResult }> {
  const res = await apiClient.post<{ success: boolean; data: UpgradeResult }>(
    "/users/subscription/confirm",
    { paymentToken },
  );
  return res.data;
}
