import { PaidService } from './paid-service.model';
import { Photo } from './photo.model';

export interface Accommodation {
  id: number;
  slug: string;
  title: string;
  description: string;
  paid_services?: PaidService[];
  photos?: Photo[];
  average_rating?: number | null;
  review_count?: number;
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

