export interface Photo {
  id: number;
  accommodation: number;
  accommodation_title?: string;
  uploaded_by: number;
  uploaded_by_email?: string;
  url: string;
  upload_type: 'accommodation' | 'review';
  caption?: string;
  created_at: string;
}
