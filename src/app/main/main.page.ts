// --- Al principio, en los imports ---
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { 
  IonTabs, IonTab, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonTabBar, IonTabButton, IonIcon, IonButton,
  IonSearchbar, IonList, IonItem, IonLabel, IonThumbnail
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { StreamViewPage } from '../pages/stream-view/stream-view.page';

import { MusicService } from '../services/music';

import { addIcons } from 'ionicons';
import { library, playCircle, radio, search } from 'ionicons/icons';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonTabs, IonTab, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonTabBar, IonTabButton, IonIcon, IonButton,
    IonSearchbar, IonList, IonItem, IonLabel, IonThumbnail
  ]
})
export class MainPage {

  private currentStream: MediaStream | null = null;
  public searchResults: any[] = []; 
  constructor(
    private musicService: MusicService,
    private modalCtrl: ModalController
  ) {
    addIcons({ library, playCircle, radio, search });
  }

  async iniciarStream() {
    const modal = await this.modalCtrl.create({ component: StreamViewPage, componentProps: { streamType: 'video' } });
    await modal.present();
  }

  handleSearch(event: any) {
    const searchTerm = event.detail.value;

    if (searchTerm && searchTerm.trim() !== '') {
      this.musicService.searchTracks(searchTerm).subscribe(
        (data: any) => {
          this.searchResults = data.results.trackmatches.track;
          console.log(this.searchResults);
        },
        (error: any) => {
          console.error('Error al buscar en Last.fm', error);
          this.searchResults = [];
        }
      );
    } else {
      this.searchResults = [];
    }
  }

  async iniciarSoloAudio() {
    const modal = await this.modalCtrl.create({ component: StreamViewPage, componentProps: { streamType: 'audio' } });
    await modal.present();
  }
  
}