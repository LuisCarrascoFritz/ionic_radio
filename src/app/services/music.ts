import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private apiUrl = 'https://api.deezer.com';
  private corsProxy = 'https://corsproxy.io/?';

  constructor(private http: HttpClient) {
    console.log('MusicService constructor - HttpClient inyectado:', !!this.http);
  }

  searchTracks(query: string): Observable<any[]> {
    const searchUrl = `${this.apiUrl}/search?q=${encodeURIComponent(query)}`;
    const url = `${this.corsProxy}${encodeURIComponent(searchUrl)}`;
    
    console.log('🌐 URL de búsqueda completa:', url);
    
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('📦 Respuesta completa de la API:', response);
        if (response && response.data && Array.isArray(response.data)) {
          console.log(`✅ ${response.data.length} tracks encontrados`);
          return response.data;
        }
        console.warn('⚠️ Formato de respuesta inesperado');
        return [];
      }),
      catchError(error => {
        console.error('❌ Error en la petición HTTP:', error);
        return of([]);
      })
    );
  }

  getTrack(trackId: string): Observable<any> {
    const url = `${this.corsProxy}${encodeURIComponent(this.apiUrl + '/track/' + trackId)}`;
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('Error obteniendo track:', error);
        return of(null);
      })
    );
  }
}