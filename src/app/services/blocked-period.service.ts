import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlockedPeriod, CreateBlockedPeriodRequest, BlockedWeekday, CreateBlockedWeekdayRequest } from '../models/blocked-period.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class BlockedPeriodService {
  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Blocked Periods
  getBlockedPeriods(accommodationId?: number): Observable<BlockedPeriod[]> {
    let params = new HttpParams();
    if (accommodationId) {
      params = params.set('accommodation', accommodationId.toString());
    }
    return this.http.get<PaginatedResponse<BlockedPeriod>>(`${this.API_URL}/blocked-periods/`, { params }).pipe(
      map(response => response.results)
    );
  }

  createBlockedPeriod(data: CreateBlockedPeriodRequest): Observable<BlockedPeriod> {
    return this.http.post<BlockedPeriod>(`${this.API_URL}/blocked-periods/`, data);
  }

  updateBlockedPeriod(id: number, data: Partial<CreateBlockedPeriodRequest>): Observable<BlockedPeriod> {
    return this.http.patch<BlockedPeriod>(`${this.API_URL}/blocked-periods/${id}/`, data);
  }

  deleteBlockedPeriod(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/blocked-periods/${id}/`);
  }

  // Blocked Weekdays
  getBlockedWeekdays(accommodationId?: number): Observable<BlockedWeekday[]> {
    let params = new HttpParams();
    if (accommodationId) {
      params = params.set('accommodation', accommodationId.toString());
    }
    return this.http.get<PaginatedResponse<BlockedWeekday>>(`${this.API_URL}/blocked-weekdays/`, { params }).pipe(
      map(response => response.results)
    );
  }

  createBlockedWeekday(data: CreateBlockedWeekdayRequest): Observable<BlockedWeekday> {
    return this.http.post<BlockedWeekday>(`${this.API_URL}/blocked-weekdays/`, data);
  }

  updateBlockedWeekday(id: number, data: Partial<CreateBlockedWeekdayRequest>): Observable<BlockedWeekday> {
    return this.http.patch<BlockedWeekday>(`${this.API_URL}/blocked-weekdays/${id}/`, data);
  }

  deleteBlockedWeekday(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/blocked-weekdays/${id}/`);
  }
}

