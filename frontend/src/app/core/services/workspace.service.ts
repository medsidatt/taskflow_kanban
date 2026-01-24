import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Workspace, WorkspaceCreateDto, WorkspaceUpdateDto } from '../models/workspace.model';
import { WorkspaceMember, WorkspaceRole, WorkspaceMemberUpdateDto } from '../models/workspace-member.model';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private readonly API_URL = `${environment.apiUrl}/workspaces`;

  constructor(private http: HttpClient) {}

  getAllWorkspaces(): Observable<Workspace[]> {
    return this.http.get<Workspace[]>(this.API_URL);
  }

  getWorkspaceById(id: string): Observable<Workspace> {
    return this.http.get<Workspace>(`${this.API_URL}/${id}`);
  }

  createWorkspace(workspace: WorkspaceCreateDto): Observable<Workspace> {
    return this.http.post<Workspace>(this.API_URL, workspace);
  }

  updateWorkspace(id: string, workspace: WorkspaceUpdateDto): Observable<Workspace> {
    return this.http.put<Workspace>(`${this.API_URL}/${id}`, workspace);
  }

  deleteWorkspace(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getMembers(workspaceId: string): Observable<WorkspaceMember[]> {
    return this.http.get<WorkspaceMember[]>(`${this.API_URL}/${workspaceId}/members`);
  }

  addMember(workspaceId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${workspaceId}/members/${userId}`, {});
  }

  removeMember(workspaceId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${workspaceId}/members/${userId}`);
  }

  updateMemberRole(workspaceId: string, userId: string, role: WorkspaceRole): Observable<void> {
    const updateDto: WorkspaceMemberUpdateDto = { role };
    return this.http.put<void>(`${this.API_URL}/${workspaceId}/members/${userId}`, updateDto);
  }
}