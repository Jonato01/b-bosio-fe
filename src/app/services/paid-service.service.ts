import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaidService, CreatePaidServiceRequest } from '../models/paid-service.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaidServiceService {
  private readonly API_URL = `${environment.apiUrl}/paid-services`;

  constructor(private http: HttpClient) {}

  getPaidServices(accommodationId?: number): Observable<PaidService[]> {
    let params = new HttpParams();
    if (accommodationId) {
      params = params.set('accommodation', accommodationId.toString());
    }
    return this.http.get<PaginatedResponse<PaidService>>(this.API_URL + '/', { params }).pipe(
      map(response => response.results)
    );
  }

  createPaidService(data: CreatePaidServiceRequest): Observable<PaidService> {
    return this.http.post<PaidService>(this.API_URL + '/', data);
  }

  updatePaidService(id: number, data: Partial<PaidService>): Observable<PaidService> {
    return this.http.patch<PaidService>(`${this.API_URL}/${id}/`, data);
  }

  deletePaidService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`);
  }
}
