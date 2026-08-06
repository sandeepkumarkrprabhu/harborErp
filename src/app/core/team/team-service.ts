// services/teamservice.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Team } from '../../Models/Team';

export interface TeamPayload {
  teamName: string;
  teamDescription: string;
  teamLeadID: string;
  teamMembersIDs: string[];
}

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/teams`; // Adjust to your backend route

  constructor(private http: HttpClient) {}

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/get-all-teams`);
  }

  getTeamById(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }

  createUser(user: TeamPayload): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/create-team`, user);
  }

  updateUser(id: string, user: TeamPayload): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/update-team/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-team/${id}`);
  }
}
