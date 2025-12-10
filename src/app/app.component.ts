import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { DatabaseService } from './services/database';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private databaseService: DatabaseService
  ) {}

  async ngOnInit() {
    await this.initializeApp();
  }

  async initializeApp() {
    try {
      await this.platform.ready();
      
      // Solo inicializar SQLite en plataformas móviles
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        console.log('Plataforma móvil detectada, inicializando base de datos...');
        await this.databaseService.crearBD();
      } else {
        console.log('Plataforma web detectada, usando almacenamiento alternativo');
      }
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error);
    }
  }
}