import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Board, BoardCreateDto, BoardUpdateDto } from '../models/board.model';
import { BoardRole, BoardMemberUpdateDto } from '../models/board-member.model';
import { Card } from '../models/card.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private readonly API_URL = `${environment.apiUrl}/boards`;

  constructor(private http: HttpClient) {}

  getBoardsByWorkspace(workspaceId: string): Observable<Board[]> {
    const params = new HttpParams().set('workspaceId', workspaceId);
    return this.http.get<Board[]>(this.API_URL, { params });
  }

  /** All boards from every workspace the user is a member of (tasks shared across project) */
  getAllBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.API_URL);
  }

  getBoardById(id: string): Observable<Board> {
    return this.http.get<Board>(`${this.API_URL}/${id}`);
  }

  getArchivedCardsByBoard(boardId: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.API_URL}/${boardId}/archived-cards`);
  }

  createBoard(board: BoardCreateDto): Observable<Board> {
    return this.http.post<Board>(this.API_URL, board);
  }

  updateBoard(id: string, board: BoardUpdateDto): Observable<Board> {
    return this.http.put<Board>(`${this.API_URL}/${id}`, board);
  }

  deleteBoard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  addMember(boardId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${boardId}/members/${userId}`, {});
  }

  removeMember(boardId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${boardId}/members/${userId}`);
  }

  updateMemberRole(boardId: string, userId: string, role: BoardRole): Observable<void> {
    const updateDto: BoardMemberUpdateDto = { role };
    return this.http.put<void>(`${this.API_URL}/${boardId}/members/${userId}`, updateDto);
  }
}