import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Review, CreateReviewRequest } from '../models/review.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly API_URL = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getReviews(accommodationId?: number): Observable<Review[]> {
    let params = new HttpParams();
    if (accommodationId) {
      params = params.set('accommodation', accommodationId.toString());
    }
    return this.http.get<PaginatedResponse<Review>>(this.API_URL + '/', { params }).pipe(
      map(response => response.results)
    );
  }

  createReview(data: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(this.API_URL + '/', data);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`);
  }

  getAccommodationReviews(slug: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/accommodations/${slug}/reviews/`);
  }
}
