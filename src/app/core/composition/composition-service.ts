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
  private apiUrl = `${this.baseUrl}/composition/projectDetail`; // Adjust to your backend route

  constructor(private http: HttpClient) { }

  getProjectById(id: string): Observable<ProjectDetail> {
      return this.http.get<ProjectDetail>(`${this.apiUrl}/${id}`);
    }
}
