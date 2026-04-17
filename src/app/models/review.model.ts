import { Photo } from './photo.model';

export interface Review {
  id: number;
  accommodation: number;
  accommodation_title?: string;
  booking: number;
  user: number;
  user_email?: string;
  user_display_name?: string;
  rating: number;
  comment?: string;
  photos?: Photo[];
  created_at: string;
  updated_at: string;
}

export interface CreateReviewRequest {
  booking: number;
  rating: number;
  comment?: string;
}
