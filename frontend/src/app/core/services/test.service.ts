import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Card, CardCreateDto, CardUpdateDto, CardMoveDto } from '../models/card.model';
import { CardRole } from '../models/card-member.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private readonly API_URL = `${environment.apiUrl}/tests`;

  constructor(private http: HttpClient) {}
  getTests(): any {
    let httpParams = new HttpParams();
  }

  getTest(id: string): Observable<Card> {
    return this.http.get<Card>(`${this.API_URL}/${id}`);
  }
}
