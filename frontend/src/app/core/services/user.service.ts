import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserSummaryDto } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  /**
   * Update current user profile (username, email)
   */
  updateProfile(patch: { username?: string; email?: string }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, patch);
  }

  /**
   * Change current user password
   */
  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/me/change-password`, { oldPassword, newPassword });
  }

  /**
   * Get all users (admin only)
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Search users by keyword (username or email)
   */
  searchUsers(keyword: string): Observable<UserSummaryDto[]> {
    return this.http.get<UserSummaryDto[]>(`${this.apiUrl}/search`, {
      params: { keyword: keyword || '' }
    });
  }
}
