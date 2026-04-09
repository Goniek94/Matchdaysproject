import apiClient from "./client";
import type { ApiResponse } from "./config";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CollectionRarity = "common" | "rare" | "epic" | "legendary";

export interface CollectionItemDto {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  team: string | null;
  season: string | null;
  category: string | null;
  itemType: string;
  condition: string | null;
  manufacturer: string | null;
  playerName: string | null;
  playerNumber: string | null;
  isVintage: boolean;
  isPublic: boolean;
  rarity: CollectionRarity;
  acquiredYear: string | null;
  acquiredFrom: string | null;
  estimatedValue: number | null;
  views: number;
  ownerId: string;
  owner?: { id: string; username: string; avatar?: string };
  createdAt: string;
  updatedAt: string;
}

export interface CollectionUserDto {
  id: string;
  username: string;
  avatar?: string;
  name?: string;
  country?: string;
  isVerified: boolean;
  rating: number;
  reviews: number;
  createdAt: string;
  collectionItems: CollectionItemDto[];
}

export interface CollectionStatsDto {
  total: number;
  totalViews: number;
  totalValue: number;
  byRarity: Record<string, number>;
}

export interface CreateCollectionItemData {
  title: string;
  description?: string;
  images?: string[];
  team?: string;
  season?: string;
  category?: string;
  itemType?: string;
  condition?: string;
  manufacturer?: string;
  playerName?: string;
  playerNumber?: string;
  isVintage?: boolean;
  isPublic?: boolean;
  rarity?: CollectionRarity;
  acquiredYear?: string;
  acquiredFrom?: string;
  estimatedValue?: number;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const addCollectionItem = async (
  data: CreateCollectionItemData,
): Promise<ApiResponse<CollectionItemDto>> => {
  const res = await apiClient.post<ApiResponse<CollectionItemDto>>(
    "/collection",
    data,
  );
  return res.data;
};

export const getMyCollection = async (): Promise<
  ApiResponse<CollectionItemDto[]>
> => {
  const res = await apiClient.get<ApiResponse<CollectionItemDto[]>>(
    "/collection/mine",
  );
  return res.data;
};

export const getCollectionByUsername = async (
  username: string,
): Promise<ApiResponse<CollectionUserDto>> => {
  const res = await apiClient.get<ApiResponse<CollectionUserDto>>(
    `/collection/user/${username}`,
  );
  return res.data;
};

export const getCollectionStats = async (
  username: string,
): Promise<ApiResponse<CollectionStatsDto>> => {
  const res = await apiClient.get<ApiResponse<CollectionStatsDto>>(
    `/collection/user/${username}/stats`,
  );
  return res.data;
};

export const getCollectionItem = async (
  id: string,
): Promise<ApiResponse<CollectionItemDto>> => {
  const res = await apiClient.get<ApiResponse<CollectionItemDto>>(
    `/collection/item/${id}`,
  );
  return res.data;
};

export const updateCollectionItem = async (
  id: string,
  data: Partial<CreateCollectionItemData>,
): Promise<ApiResponse<CollectionItemDto>> => {
  const res = await apiClient.patch<ApiResponse<CollectionItemDto>>(
    `/collection/item/${id}`,
    data,
  );
  return res.data;
};

export const deleteCollectionItem = async (
  id: string,
): Promise<ApiResponse<void>> => {
  const res = await apiClient.delete<ApiResponse<void>>(
    `/collection/item/${id}`,
  );
  return res.data;
};
