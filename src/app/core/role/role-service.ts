// services/role.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../../Models/role';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  
  private readonly baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/roles`; 

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}`);
  }

}
