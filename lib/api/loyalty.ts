import apiClient from "./client";

/**
 * Loyalty / achievements — public reads for the social-proof section on
 * a user's profile, and authenticated reads for the caller's own
 * dashboard snapshot.
 *
 * Achievements come from the catalog seeded by `LoyaltyService.seedCatalog`;
 * the join row in `user_achievements` proves the user unlocked it.
 */

export interface PublicAchievement {
  code: string;
  title: string;
  description: string;
  icon: string | null;
  category: string;
  unlockedAt: string;
}

export async function getPublicAchievements(
  userId: string,
): Promise<PublicAchievement[]> {
  const res = await apiClient.get<{
    success: boolean;
    data: PublicAchievement[];
  }>(`/loyalty/public/${userId}`);
  return res.data.data ?? [];
}
