export interface Accommodation {
  id: number;
  slug: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface AvailabilityCheck {
  available: boolean;
  accommodation: Accommodation;
  check_in?: string;
  check_out?: string;
  conflicting_bookings?: any[];
  blocked_periods?: any[];
  conflicting_bookings_count?: number;
  blocked_periods_count?: number;
}

