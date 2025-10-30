import { Routes } from '@angular/router';
import { authGuard } from './services/auth-guard';
export const routes: Routes = [
  {
    path: 'main',
    loadComponent: () => import('./main/main.page').then((m) => m.MainPage),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'recoverpasword',
    loadComponent: () => import('./recoverpasword/recoverpasword.page').then( m => m.RecoverPaswordPage)
  },

];
