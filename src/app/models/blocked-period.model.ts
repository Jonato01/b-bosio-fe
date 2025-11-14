export interface BlockedPeriod {
  id: number;
  accommodation: number;
  accommodation_title?: string;
  start_date: string;
  end_date: string;
  reason: string;
  created_by: number;
  created_by_email?: string;
  created_at: string;
}

export interface CreateBlockedPeriodRequest {
  accommodation: number;
  start_date: string;
  end_date: string;
  reason: string;
}

export interface BlockedWeekday {
  id: number;
  accommodation: number;
  accommodation_title?: string;
  weekday: number; // 0=Monday, 6=Sunday
  start_time: string | null;
  end_time: string | null;
  reason: string;
  created_by: number;
  created_by_email?: string;
  created_at: string;
}

export interface CreateBlockedWeekdayRequest {
  accommodation: number;
  weekday: number;
  start_time?: string;
  end_time?: string;
  reason: string;
}

