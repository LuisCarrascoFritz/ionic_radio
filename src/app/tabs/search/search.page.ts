import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonThumbnail, IonLabel, IonSpinner, IonIcon } from '@ionic/angular/standalone';
import { MusicService } from '../../services/music';
import { firstValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { searchOutline, musicalNotesOutline } from 'ionicons/icons';

interface SearchResult {
  title: string;
  artist: string;
  thumbnail: string;
  preview?: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonThumbnail, IonLabel, IonSpinner, IonIcon]
})
export class SearchPage {
  searchResults: SearchResult[] = [];
  searchQuery = '';
  isSearching = false;

  constructor(private musicService: MusicService) {
    addIcons({ searchOutline, musicalNotesOutline });
  }

  async onSearch(event: any) {
    const query = event?.detail?.value || '';
    this.searchQuery = query;
    
    if (query && query.trim().length > 2) {
      await this.performSearch(query.trim());
    } else {
      this.searchResults = [];
    }
  }

  private async performSearch(query: string) {
    this.isSearching = true;
    console.log('🔍 Buscando:', query);
    
    try {
      const results = await firstValueFrom(this.musicService.searchTracks(query));
      console.log('✅ Resultados de la API:', results);
      
      if (Array.isArray(results) && results.length > 0) {
        this.searchResults = results.map((track: any) => ({
          title: track.title || track.name || 'Sin título',
          artist: track.artist?.name || track.artists?.[0]?.name || track.artistName || 'Artista Desconocido',
          thumbnail: track.album?.cover_medium || track.album?.images?.[0]?.url || track.albumArt || 'assets/default-album.png',
          preview: track.preview || track.preview_url || track.previewUrl
        }));
        console.log('📊 Resultados procesados:', this.searchResults.length);
      } else {
        console.warn('⚠️ La API no devolvió resultados');
        this.searchResults = [];
      }
    } catch (error) {
      console.error('❌ Error al buscar canciones:', error);
      this.searchResults = [];
    } finally {
      this.isSearching = false;
    }
  }

  onImageError(event: any) {
    console.log('Error cargando imagen, usando placeholder');
    event.target.src = 'assets/default-album.png';
  }
}
