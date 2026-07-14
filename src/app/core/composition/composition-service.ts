// services/Composition.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProjectDetail } from '../../Models/Composition';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CompositionService {
  private readonly baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/composition/project-details`;

  constructor(private http: HttpClient) {}

  getProjectById(id: string): Observable<ProjectDetail> {
    return this.http.post<ProjectDetail>(
      `${this.apiUrl}/${id}`,   
      {                         
        page: 1,
        perPage: 10
      }
    );
  }
}
