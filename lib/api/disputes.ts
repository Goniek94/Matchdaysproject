import apiClient from "./client";
import type { ApiResponse } from "./config";

export type DisputeType =
  | "item_not_received"
  | "item_not_as_described"
  | "seller_unresponsive"
  | "fraud"
  | "report_user"
  | "other";

export type DisputeStatus =
  | "open"
  | "awaiting_seller"
  | "awaiting_buyer"
  | "in_review"
  | "resolved"
  | "closed";

export interface DisputeMessage {
  id: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
  sender: { id: string; username: string; avatar?: string };
}

export interface Dispute {
  id: string;
  type: DisputeType;
  status: DisputeStatus;
  subject: string;
  description: string;
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  auctionId?: string;
  auction?: { id: string; title: string; images: string[] } | null;
  reporter: { id: string; username: string; avatar?: string };
  respondent?: { id: string; username: string; avatar?: string } | null;
  messages: DisputeMessage[];
}

export interface CreateDisputePayload {
  type: DisputeType;
  subject: string;
  description: string;
  auctionId?: string;
  respondentId?: string;
}

export const createDispute = async (
  payload: CreateDisputePayload,
): Promise<ApiResponse<Dispute>> => {
  const res = await apiClient.post<ApiResponse<Dispute>>("/disputes", payload);
  return res.data;
};

export const getMyDisputes = async (): Promise<ApiResponse<Dispute[]>> => {
  const res = await apiClient.get<ApiResponse<Dispute[]>>("/disputes/mine");
  return res.data;
};

export const getDispute = async (id: string): Promise<ApiResponse<Dispute>> => {
  const res = await apiClient.get<ApiResponse<Dispute>>(`/disputes/${id}`);
  return res.data;
};

export const addDisputeMessage = async (
  id: string,
  content: string,
): Promise<ApiResponse<DisputeMessage>> => {
  const res = await apiClient.post<ApiResponse<DisputeMessage>>(
    `/disputes/${id}/messages`,
    { content },
  );
  return res.data;
};
