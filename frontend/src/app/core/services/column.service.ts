import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BoardColumn, ColumnCreateDto, ColumnUpdateDto } from '../models/board-column.model';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  private readonly API_URL = `${environment.apiUrl}/columns`;

  constructor(private http: HttpClient) {}

  getColumnsByBoard(boardId: string): Observable<BoardColumn[]> {
    const params = new HttpParams().set('boardId', boardId);
    return this.http.get<BoardColumn[]>(this.API_URL, { params });
  }

  getColumnById(id: string): Observable<BoardColumn> {
    return this.http.get<BoardColumn>(`${this.API_URL}/${id}`);
  }

  createColumn(column: ColumnCreateDto): Observable<BoardColumn> {
    return this.http.post<BoardColumn>(this.API_URL, column);
  }

  updateColumn(id: string, column: ColumnUpdateDto): Observable<BoardColumn> {
    return this.http.put<BoardColumn>(`${this.API_URL}/${id}`, column);
  }

  deleteColumn(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
