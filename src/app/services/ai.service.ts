import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ConciergeReply {
  reply: string;
}

export interface TravelerType {
  type: string;
  description: string;
}

export interface SurpriseItinerary {
  html: string;
  emailed: boolean;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  concierge(question: string, history?: { role: string; text: string }[]): Observable<ConciergeReply> {
    return this.http.post<ConciergeReply>(`${this.API_URL}/concierge/`, {
      question,
      history: history ?? [],
    });
  }

  travelerType(bookingId: number, answers: string[]): Observable<TravelerType> {
    return this.http.post<TravelerType>(
      `${this.API_URL}/bookings/${bookingId}/traveler-type/`,
      { answers },
    );
  }

  surpriseItinerary(bookingId: number, sendEmail = false): Observable<SurpriseItinerary> {
    const url = `${this.API_URL}/bookings/${bookingId}/surprise-itinerary/`
      + (sendEmail ? '?send_email=true' : '');
    return this.http.post<SurpriseItinerary>(url, {});
  }
}
