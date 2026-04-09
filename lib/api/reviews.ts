import apiClient from "./client";
import type { ApiResponse } from "./config";

export type ReviewSentiment = "positive" | "neutral" | "negative";

export interface ReviewDto {
  id: string;
  rating: number;
  sentiment: ReviewSentiment;
  comment: string | null;
  role: "buyer" | "seller";
  auctionId: string;
  reviewerId: string;
  revieweeId: string;
  reviewer: { id: string; username: string; avatar?: string };
  auction: { id: string; title: string; images?: string[] };
  createdAt: string;
}

export interface PendingReviewDto {
  auctionId: string;
  title: string;
  image: string | null;
  status: string;
  updatedAt: string;
  isBuyer: boolean;
  counterparty: { id: string; username: string; avatar?: string } | null;
  price: number;
}

export interface ReviewStatsDto {
  total: number;
  average: number;
  positive: number;
  neutral: number;
  negative: number;
  positivePercentage: number;
}

export interface CreateReviewData {
  rating: number;
  sentiment: ReviewSentiment;
  comment?: string;
}

export const submitReview = async (
  auctionId: string,
  data: CreateReviewData,
): Promise<ApiResponse<ReviewDto>> => {
  const res = await apiClient.post<ApiResponse<ReviewDto>>(
    `/reviews/auction/${auctionId}`,
    data,
  );
  return res.data;
};

export const getPendingReviews = async (): Promise<
  ApiResponse<PendingReviewDto[]>
> => {
  const res = await apiClient.get<ApiResponse<PendingReviewDto[]>>(
    "/reviews/pending",
  );
  return res.data;
};

export const getReviewsByUser = async (
  userId: string,
): Promise<ApiResponse<ReviewDto[]>> => {
  const res = await apiClient.get<ApiResponse<ReviewDto[]>>(
    `/reviews/user/${userId}`,
  );
  return res.data;
};

export const getReviewStats = async (
  userId: string,
): Promise<ApiResponse<ReviewStatsDto>> => {
  const res = await apiClient.get<ApiResponse<ReviewStatsDto>>(
    `/reviews/user/${userId}/stats`,
  );
  return res.data;
};

export const getReviewsByAuction = async (
  auctionId: string,
): Promise<ApiResponse<ReviewDto[]>> => {
  const res = await apiClient.get<ApiResponse<ReviewDto[]>>(
    `/reviews/auction/${auctionId}`,
  );
  return res.data;
};
