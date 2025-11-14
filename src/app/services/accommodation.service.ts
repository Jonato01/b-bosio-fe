import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Accommodation, AvailabilityCheck } from '../models/accommodation.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  private readonly API_URL = `${environment.apiUrl}/accommodations`;

  constructor(private http: HttpClient) {}

  getAccommodations(): Observable<Accommodation[]> {
    return this.http.get<PaginatedResponse<Accommodation>>(this.API_URL + '/').pipe(
      map(response => response.results)
    );
  }

  getAccommodation(slug: string): Observable<Accommodation> {
    return this.http.get<Accommodation>(`${this.API_URL}/${slug}/`);
  }

  checkAvailability(slug: string, checkIn: string, checkOut: string): Observable<AvailabilityCheck> {
    const params = new HttpParams()
      .set('check_in', checkIn)
      .set('check_out', checkOut);

    return this.http.get<AvailabilityCheck>(`${this.API_URL}/${slug}/availability/`, { params });
  }

  createAccommodation(data: Partial<Accommodation>): Observable<Accommodation> {
    return this.http.post<Accommodation>(this.API_URL + '/', data);
  }

  updateAccommodation(slug: string, data: Partial<Accommodation>): Observable<Accommodation> {
    return this.http.patch<Accommodation>(`${this.API_URL}/${slug}/`, data);
  }

  deleteAccommodation(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${slug}/`);
  }
}
