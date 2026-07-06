// services/aws.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AwsResource } from '../../../Models/AwsResource';

@Injectable({
  providedIn: 'root'
})
export class AwsService {
  
  private readonly baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/aws-api`;

  constructor(private http: HttpClient) {}

  // POST to /aws-api/resources with body { services: ["all"] }
  fetchResources(service?: string, region?: string): Observable<AwsResource[]> {
    const body: any = {
      services: service ? [service] : ['all']
    };

    if (region) {
      body.region = region;
    }

    return this.http.post<{ data: AwsResource[] }>(`${this.apiUrl}/resources`, body)
      .pipe(map(res => res.data));
  }

}
