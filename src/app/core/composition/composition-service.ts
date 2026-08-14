// services/Composition.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  DashboardKPICard,
  DashboardRecentActivities,
  ProjectDetail,
  ProjectDetailEnvironment,
  ProjectDeploymentsGraph,
} from '../../Models/Composition';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CompositionService {
  private readonly baseUrl = environment.apiBaseUrl;
  private baseApiUrl = `${this.baseUrl}/composition`;
  private projectApiUrl = `${this.baseApiUrl}/composition/project-details`;
  private apiUrlEnv = `${this.baseUrl}/composition/project-environment-details`;

  constructor(private http: HttpClient) {}

  getProjectById(id: string): Observable<ProjectDetail> {
    return this.http
      .post<ProjectDetail>(`${this.projectApiUrl}/${id}`, {
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
    return this.http
      .get<ProjectDetailEnvironment>(`${this.apiUrlEnv}/${id}/${envId}`, {})
      .pipe
      // tap((response) => {
      //   console.log('Raw API response for project details:', response);
      // }),
      ();
  }

  getDashboardKPI(): Observable<DashboardKPICard> {
    return this.http.get<DashboardKPICard>(`${this.baseApiUrl}/dashboard-kpi`);
    // .pipe(tap((response) => console.log('Raw API response:', response)));
  }

  getDashboardRecentActivites(): Observable<DashboardRecentActivities[]> {
    return this.http.get<DashboardRecentActivities[]>(
      `${this.baseApiUrl}/dashboard-recent-activities`,
    );
    // .pipe(tap((response) => console.log('Raw API response:', response)));
  }

  getDashboardProjectDeploymentsGraph(): Observable<ProjectDeploymentsGraph[]> {
    return this.http.get<ProjectDeploymentsGraph[]>(
      `${this.baseApiUrl}/dashboard-project-deployments-graph`,
    );
    // .pipe(tap((response) => console.log('Dashboard project deployments graph:', response)));
  }
}
