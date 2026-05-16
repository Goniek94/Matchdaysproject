import apiClient from "./client";

/**
 * Public B2B inquiry capture — used by the "Are you a shop?" CTA on the
 * pricing page. Anonymous-allowed; the backend stamps userId if you're
 * logged in.
 *
 * Backend route: POST /business-inquiries (5 req/min throttle).
 */
export interface CreateBusinessInquiryPayload {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  message: string;
  estimatedVolume?: string;
}

export async function submitBusinessInquiry(
  payload: CreateBusinessInquiryPayload,
): Promise<{ id: string }> {
  const res = await apiClient.post<{
    success: boolean;
    data: { id: string };
  }>("/business-inquiries", payload);
  return res.data.data;
}
