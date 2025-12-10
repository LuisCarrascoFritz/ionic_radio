import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular, Platform } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http'; 
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(), 
    SQLite,
    Platform
  ],
}).catch(err => console.error('Error al iniciar la aplicación:', err));