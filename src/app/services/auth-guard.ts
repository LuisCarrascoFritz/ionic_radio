import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('--- AuthGuard se ha activado ---');
  
  const isAuth = await authService.isAuthenticated(); 
  console.log('¿Está autenticado? (Respuesta de SQLite):', isAuth);

  if (isAuth) {
    return true; 
  }
  
  console.log('Acceso denegado - Redirigiendo a login');
  router.navigate(['/login']);
  return false;
};