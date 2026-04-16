import apiClient from "./client";

export interface UpgradeResult {
  subscriptionTier: string;
  subscriptionExpiry: string | null;
}

export async function upgradeSubscription(
  tier: string,
  months: number,
): Promise<{ success: boolean; data: UpgradeResult }> {
  const res = await apiClient.post<{ success: boolean; data: UpgradeResult }>(
    "/users/subscription",
    { tier, months },
  );
  return res.data;
}
