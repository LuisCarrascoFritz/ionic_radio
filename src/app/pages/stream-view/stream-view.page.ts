import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/angular/standalone';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-stream-view',
  templateUrl: './stream-view.page.html',
  styleUrls: ['./stream-view.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent]
})
export class StreamViewPage implements OnInit {
  @Input() streamType: 'video' | 'audio' = 'video';
  private currentStream: MediaStream | null = null;

  constructor(private modalCtrl: ModalController, private navParams: NavParams) {}

  async ngOnInit() {
    const incomingType = this.navParams.get('streamType');
    if (incomingType === 'video' || incomingType === 'audio') {
      this.streamType = incomingType;
    }
    const constraints: MediaStreamConstraints = this.streamType === 'video' ? { video: { facingMode: 'user' }, audio: true } : { audio: true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.currentStream = stream;
    const video = document.getElementById('camera-preview') as HTMLVideoElement | null;
    if (video) {
      video.srcObject = stream;
      if (this.streamType === 'video') {
        await video.play();
      }
    }
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }
}


