// services/repo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Orgs } from '../../../Models/Organization';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private readonly baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/github/orgs`;

  constructor(private http: HttpClient) {}

  /**
   * Fetch GitHub repositories
   * @param org optional organization login name
   */
  fetchOrganizations(org?: string): Observable<Orgs[]> {
    const url = org ? `${this.apiUrl}?org=${org}` : this.apiUrl;
    return this.http.get<Orgs[]>(url);
  }
}
