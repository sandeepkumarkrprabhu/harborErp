import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Branch } from '../../../Models/branch';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private readonly baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/github/branches`;

  constructor(private http: HttpClient) {}

  /**
   * Fetch branches for a given repo
   * @param owner full owner string (e.g. "sangeeth/pumex")
   * @param repo repository name (e.g. "harbor-backend")
   */
  fetchBranches(owner: string, repo: string): Observable<Branch[]> {
    const url = `${this.apiUrl}?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`;
    return this.http.get<Branch[]>(url);
  }
}
