// services/Composition.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ProjectDetail, ProjectDetailEnvironment } from '../../Models/Composition';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CompositionService {
  private readonly baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/composition/project-details`;
  private apiUrlEnv = `${this.baseUrl}/composition/project-environment-details`;

  constructor(private http: HttpClient) {}

  getProjectById(id: string): Observable<ProjectDetail> {
    return this.http
      .post<ProjectDetail>(`${this.apiUrl}/${id}`, {
        page: 1,
        perPage: 10,
      })
      .pipe(
        tap((response) => {
          //console.log('Raw API response for project details:', response);
        }),
      );
  }

  getProjectByIdEnv(id: string, envId: string): Observable<ProjectDetailEnvironment> {
    return this.http.get<ProjectDetailEnvironment>(`${this.apiUrlEnv}/${id}/${envId}`, {}).pipe(
      tap((response) => {
        console.log('Raw API response for project details:', response);
      }),
    );
  }
}
