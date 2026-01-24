import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comment, CommentCreateDto } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly API_URL = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) {}

  getCommentsByCard(cardId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.API_URL}/cards/${cardId}`);
  }

  createComment(comment: CommentCreateDto): Observable<Comment> {
    return this.http.post<Comment>(this.API_URL, comment);
  }

  updateComment(id: string, content: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.API_URL}/${id}`, content, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
