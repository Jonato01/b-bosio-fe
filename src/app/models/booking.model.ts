export interface GuestData {
  full_name: string;
  email: string;
  phone: string;
  birth_date?: string;
  document_type?: string;
  document_number?: string;
  notes?: string;
}

export interface BookingGuest extends GuestData {
  id: number;
  booking: number;
}

export interface Booking {
  id: number;
  accommodation: number;
  accommodation_title?: string;
  user: number;
  user_email?: string;
  check_in: string;
  check_out: string;
  num_guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
  notes?: string;
  created_at: string;
  updated_at: string;
  guests_details?: BookingGuest[];
}

export interface CreateBookingRequest {
  accommodation: number;
  user?: number;
  check_in: string;
  check_out: string;
  num_guests: number;
  notes?: string;
  guests_data?: GuestData[];
}

export interface BookingAuditLog {
  id: number;
  booking: number;
  action: string;
  actor_user: number;
  actor_user_email: string;
  data_json: any;
  created_at: string;
}

