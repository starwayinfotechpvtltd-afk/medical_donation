import { api } from './api-client';

export interface DonationCampaign {
  id: number;
  title: string;
  description?: string | null;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  goal_amount: number | string;
  raised_amount: number | string;
  currency: string;
  thumbnail_url?: string | null;
  patient_name?: string | null;
}

export interface DonationPayload {
  amount: number;
  currency: string;
  payment_method?: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'cash' | 'bank_transfer' | 'other';
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  donor_pan?: string | null;
  donor_address?: string | null;
  is_anonymous: boolean;
  donor_message?: string | null;
}

export interface DonationTransaction {
  id: number;
  donation_id: number;
  amount: number | string;
  currency: string;
  payment_method: string;
  payment_status: string;
  transaction_ref: string;
  donor_message?: string | null;
  created_at: string;
}

export interface DonationInitResponse {
  transaction_id: number;
  transaction_ref: string;
  razorpay_key_id: string;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  purpose: string;
}

export interface DonationStats {
  total_campaigns: number;
  active_campaigns: number;
  total_raised: number | string;
  total_transactions: number;
  today_transactions: number;
  today_raised: number | string;
  named_donations: number;
  unique_donors: number;
}

export interface RecentDonation {
  id: number;
  amount: number | string;
  currency: string;
  created_at: string;
  is_anonymous: number;
  donor_name?: string | null;
  donor_email?: string | null;
  donor_phone?: string | null;
  transaction_ref?: string | null;
  purpose: string;
}

export const donationApi = {
  donate(payload: DonationPayload) {
    return api.post<DonationInitResponse>('/donations/donate', payload);
  },

  verifyPayment(payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    return api.post<DonationTransaction>('/donations/verify-payment', payload);
  },

  getStats() {
    return api.get<DonationStats>('/donations/stats');
  },

  getRecent(limit = 20) {
    return api.get<RecentDonation[]>('/donations/recent', { limit });
  },
};
