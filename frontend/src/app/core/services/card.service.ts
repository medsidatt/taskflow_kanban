import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Card, CardCreateDto, CardUpdateDto, CardMoveDto } from '../models/card.model';
import { CardRole } from '../models/card-member.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private readonly API_URL = `${environment.apiUrl}/cards`;

  constructor(private http: HttpClient) {}

  getCardsByColumn(columnId: string): Observable<Card[]> {
    const params = new HttpParams().set('columnId', columnId);
    return this.http.get<Card[]>(this.API_URL, { params });
  }

  getCardById(id: string): Observable<Card> {
    return this.http.get<Card>(`${this.API_URL}/${id}`);
  }

  createCard(card: CardCreateDto): Observable<Card> {
    return this.http.post<Card>(this.API_URL, card);
  }

  updateCard(id: string, card: CardUpdateDto): Observable<Card> {
    return this.http.put<Card>(`${this.API_URL}/${id}`, card);
  }

  deleteCard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  moveCard(id: string, moveDto: CardMoveDto): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}/move`, moveDto);
  }

  addAssignee(cardId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${cardId}/assignees/${userId}`, {});
  }

  removeAssignee(cardId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${cardId}/assignees/${userId}`);
  }

  updateMemberRole(cardId: string, userId: string, role: CardRole): Observable<void> {
    const params = new HttpParams().set('role', role);
    return this.http.put<void>(`${this.API_URL}/${cardId}/members/${userId}`, {}, { params });
  }
}
