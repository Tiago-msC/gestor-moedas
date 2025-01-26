import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoedaService {
  private apiUrl = 'https://my-json-server.typicode.com/Tiago-msC/gestor-moedas/moedas';

  constructor(private http: HttpClient) { }

  getMoedas(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getMoeda(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addMoeda(moeda: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, moeda);
  }

  updateMoeda(id: string, moeda: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, moeda);
  }

  deleteMoeda(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
