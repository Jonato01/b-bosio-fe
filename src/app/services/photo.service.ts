import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Photo } from '../models/photo.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private readonly API_URL = `${environment.apiUrl}/photos`;

  constructor(private http: HttpClient) {}

  getPhotos(accommodationId?: number | null): Observable<Photo[]> {
    let params = new HttpParams();
    if (accommodationId) {
      params = params.set('accommodation', accommodationId.toString());
    }
    return this.http.get<PaginatedResponse<Photo>>(this.API_URL + '/', { params }).pipe(
      map(response => response.results)
    );
  }

  uploadPhoto(accommodationId: number, file: File, uploadType: string, caption: string): Observable<Photo> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('accommodation', accommodationId.toString());
    formData.append('upload_type', uploadType);
    if (caption) {
      formData.append('caption', caption);
    }
    return this.http.post<Photo>(`${this.API_URL}/upload/`, formData);
  }

  deletePhoto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`);
  }
}
