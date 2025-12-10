import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { videocam, mic, videocamOff } from 'ionicons/icons';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.page.html',
  styleUrls: ['./radio.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon]
})
export class RadioPage {
  showVideo = false;
  isPlaying = false;

  constructor() {
    addIcons({ videocam, mic, videocamOff });
  }

  toggleVideo() {
    this.showVideo = !this.showVideo;
  }

  startAudioStream() {
    console.log('Stream de audio iniciado');
    // Implementar lógica de streaming de audio
  }

  toggleRadio() {
    this.isPlaying = !this.isPlaying;
    console.log('Radio:', this.isPlaying ? 'Playing' : 'Stopped');
  }
}
