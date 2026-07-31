// services/repo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Repo } from '../../../Models/Repo';

@Injectable({
  providedIn: 'root',
})
export class RepoService {
  private readonly baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/github/repos`;

  constructor(private http: HttpClient) {}

  /**
   * Fetch GitHub repositories
   * @param org optional organization login name
   */
  fetchRepos(org?: string): Observable<Repo[]> {
    const url = org ? `${this.apiUrl}?org=${org}` : this.apiUrl;
    return this.http.get<Repo[]>(url);
  }
}
