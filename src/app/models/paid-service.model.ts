export interface PaidService {
  id: number;
  accommodation: number;
  accommodation_title?: string;
  name: string;
  description?: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePaidServiceRequest {
  accommodation: number;
  name: string;
  description?: string;
  price: number;
}
