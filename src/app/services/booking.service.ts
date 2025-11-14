import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, CreateBookingRequest, BookingAuditLog } from '../models/booking.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly API_URL = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getBookings(filters?: {
    status?: string;
    accommodation?: number;
    start_date?: string;
    end_date?: string;
    page?: number;
  }): Observable<PaginatedResponse<Booking>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.accommodation) params = params.set('accommodation', filters.accommodation.toString());
      if (filters.start_date) params = params.set('start_date', filters.start_date);
      if (filters.end_date) params = params.set('end_date', filters.end_date);
      if (filters.page) params = params.set('page', filters.page.toString());
    }

    return this.http.get<PaginatedResponse<Booking>>(this.API_URL + '/', { params });
  }

  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.API_URL}/${id}/`);
  }

  createBooking(data: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.API_URL + '/', data);
  }

  updateBooking(id: number, data: Partial<CreateBookingRequest>): Observable<Booking> {
    return this.http.patch<Booking>(`${this.API_URL}/${id}/`, data);
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`);
  }

  confirmBooking(id: number): Observable<Booking> {
    return this.http.post<Booking>(`${this.API_URL}/${id}/confirm/`, {});
  }

  cancelBooking(id: number): Observable<Booking> {
    return this.http.post<Booking>(`${this.API_URL}/${id}/cancel/`, {});
  }

  rejectBooking(id: number): Observable<Booking> {
    return this.http.post<Booking>(`${this.API_URL}/${id}/reject/`, {});
  }

  getBookingAuditLog(id: number): Observable<BookingAuditLog[]> {
    return this.http.get<BookingAuditLog[]>(`${this.API_URL}/${id}/audit_log/`);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${environment.apiUrl}/users/my_bookings/`);
  }
}
