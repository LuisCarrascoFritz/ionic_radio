import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private apiKey = '5570009fcd67409c51509c5d22d8dd16'; 
  private apiUrl = 'https://ws.audioscrobbler.com/2.0/';

  constructor(private http: HttpClient) { }

  searchTracks(term: string): Observable<any> {
    const params = [
      `method=track.search`,
      `track=${term}`,
      `api_key=${this.apiKey}`,
      `format=json`
    ].join('&');

    return this.http.get(`${this.apiUrl}?${params}`);
  }
}