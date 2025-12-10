import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonButton, IonIcon, IonList, IonItem, IonLabel, IonSpinner,
  ActionSheetController, AlertController
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth';
import { addIcons } from 'ionicons';
import { 
  personOutline, notificationsOutline, lockClosedOutline, 
  logOutOutline, chevronBack, person, camera, calendarOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel, 
    IonSpinner, RouterLink
  ]
})
export class ProfilePage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  usuario: any = null;
  fotoPerfilUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {
    addIcons({ 
      personOutline, notificationsOutline, lockClosedOutline, 
      logOutOutline, chevronBack, person, camera, calendarOutline
    });
  }

  async ngOnInit() {
    await this.cargarUsuario();
    this.cargarFotoPerfil();
  }

  async cargarUsuario() {
    try {
      // Intentar obtener del localStorage con diferentes claves
      const userString = localStorage.getItem('currentUser') || localStorage.getItem('user');
      
      if (userString) {
        try {
          // Intentar parsear como JSON
          this.usuario = JSON.parse(userString);
        } catch (parseError) {
          // Si falla el parse, crear objeto manualmente
          console.log('El usuario no está en formato JSON, creando objeto...');
          this.usuario = {
            email: userString,
            username: userString.split('@')[0] || 'Usuario'
          };
        }
        console.log('Usuario cargado en perfil:', this.usuario);
      } else {
        console.error('No se encontró usuario en localStorage');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      this.router.navigate(['/login']);
    }
  }

  cargarFotoPerfil() {
    const fotoGuardada = localStorage.getItem('fotoPerfil');
    if (fotoGuardada) {
      this.fotoPerfilUrl = fotoGuardada;
    }
  }

  async cambiarFoto() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Cambiar Foto de Perfil',
      buttons: [
        {
          text: 'Tomar Foto',
          icon: 'camera',
          handler: () => {
            this.seleccionarFoto(true);
          }
        },
        {
          text: 'Elegir de Galería',
          icon: 'image',
          handler: () => {
            this.seleccionarFoto(false);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  seleccionarFoto(useCamera: boolean) {
    const input = this.fileInput.nativeElement;
    if (useCamera) {
      input.setAttribute('capture', 'environment');
    } else {
      input.removeAttribute('capture');
    }
    input.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoPerfilUrl = e.target.result;
        localStorage.setItem('fotoPerfil', this.fotoPerfilUrl!);
      };
      reader.readAsDataURL(file);
    }
  }

  async cerrarSesion() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }
}