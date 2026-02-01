import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActivityLog } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly API_URL = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) {}

  getActivitiesByEntity(entityId: string): Observable<ActivityLog[]> {
    const params = new HttpParams().set('entityId', entityId);
    return this.http.get<ActivityLog[]>(this.API_URL, { params });
  }

  getActivitiesByWorkspace(workspaceId: string): Observable<ActivityLog[]> {
    const params = new HttpParams().set('workspaceId', workspaceId);
    return this.http.get<ActivityLog[]>(this.API_URL, { params });
  }

  getMyActivities(): Observable<ActivityLog[]> {
    const params = new HttpParams().set('me', 'true');
    return this.http.get<ActivityLog[]>(this.API_URL, { params });
  }
}
