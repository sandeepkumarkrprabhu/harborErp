// services/aws.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, Observable, catchError, tap, throwError, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AwsResource } from '../../../Models/AwsResource';

@Injectable({
  providedIn: 'root',
})
export class AwsService {
  private readonly baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/aws-api`;

  constructor(private http: HttpClient) {}

  fetchResources(service?: string, region?: string): Observable<AwsResource[]> {
    const body: any = {
      services: service?.toLocaleLowerCase() ? [service] : ['all'],
    };

    if (region) {
      body.region = region;
    }

    return this.http.post<{ data: AwsResource[] }>(`${this.apiUrl}/resources`, body).pipe(
      tap((response) => {
        // Log the raw response and the extracted data
        console.debug('[AwsService] fetchResources response', response);
        console.debug('[AwsService] extracted resources', response?.data);
      }),

      map((res) => res.data || []),

      catchError((err: HttpErrorResponse) => {
        // Log full error details for debugging
        console.error('[AwsService] fetchResources failed', {
          status: err.status,
          message: err.message,
          url: err.url,
          error: err.error,
        });

        // Re-throw so callers can handle the error
        return throwError(() => err);
      }),

      finalize(() => console.debug('[AwsService] fetchResources completed')),
    );
  }
}
