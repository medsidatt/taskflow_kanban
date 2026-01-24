import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Label, LabelCreateDto, LabelUpdateDto } from '../models/label.model';

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  private readonly API_URL = `${environment.apiUrl}/labels`;

  constructor(private http: HttpClient) {}

  getLabelsByBoard(boardId: string): Observable<Label[]> {
    const params = new HttpParams().set('boardId', boardId);
    return this.http.get<Label[]>(this.API_URL, { params });
  }

  addLabelToCard(cardId: string, labelId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/cards/${cardId}/labels/${labelId}`, {});
  }

  removeLabelFromCard(cardId: string, labelId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/cards/${cardId}/labels/${labelId}`);
  }

  createLabel(label: LabelCreateDto): Observable<Label> {
    return this.http.post<Label>(this.API_URL, label);
  }

  updateLabel(id: string, label: LabelUpdateDto): Observable<Label> {
    return this.http.put<Label>(`${this.API_URL}/${id}`, label);
  }

  deleteLabel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
