import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SearchResult } from '../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly API_URL = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) {}

  search(q: string): Observable<SearchResult> {
    const params = new HttpParams().set('q', q ?? '');
    return this.http.get<SearchResult>(this.API_URL, { params });
  }
}
