import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GithubUser } from '../../Models/GithubUser'

@Injectable({ providedIn: 'root' })
export class GithubService {
    private readonly apiUrl = 'http://localhost:3535/api/v1/github/validate-user';

    constructor(private http: HttpClient) { }

    // Renamed to follow camelCase and clarity
    getUserByUsername(username: string): Observable<GithubUser> {
        const params = new HttpParams().set('username', username ?? '');
        return this.http.get<GithubUser>(this.apiUrl, { params }).pipe(
            catchError((err) => {
                // Optional: log or transform the error before rethrowing
                console.error('Failed to validate GitHub user', err);
                return throwError(() => err);
            }),
        );
    }
}
