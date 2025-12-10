import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'main',
    loadComponent: () => import('./main/main.page').then((m) => m.MainPage),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./tabs/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'radio',
        loadComponent: () => import('./tabs/radio/radio.page').then(m => m.RadioPage)
      },
      {
        path: 'library',
        loadComponent: () => import('./tabs/library/library.page').then(m => m.LibraryPage)
      },
      {
        path: 'search',
        loadComponent: () => import('./tabs/search/search.page').then(m => m.SearchPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.page').then((m) => m.ProfilePage)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
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
