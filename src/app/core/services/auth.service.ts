import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Login } from '../../shared/interface/Login';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  role: string = '';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  signIn(data: Login): Observable<any> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return this.http.get(environment.serverUrl + "/usuarios", { headers, params: data as any }).pipe(
      map((response: any) => {
        if (Array.isArray(response) && response.length === 0) {
          throw new Error('No users found');
        }
        const user = response[0];
        const base64User = btoa(JSON.stringify(user));
        this.storageService.setToken(base64User);
        return user;
      })
    );
  }

  getToken(): string | null {
    return this.storageService.getToken();
  }

  clearToken() {
    this.storageService.clearToken();
  }

  isLoggedIn(): boolean {
    return !!this.storageService.getToken();
  }

  getProfile(): { email: string, name: string } | null {
    if (this.isLoggedIn()) {
      const user = JSON.parse(atob(this.getToken() || ''));
      return { email: user.email, name: user.nome };
    }
    return null;
  }
}
