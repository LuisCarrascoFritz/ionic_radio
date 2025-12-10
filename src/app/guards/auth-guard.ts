import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('--- AuthGuard activado para ruta:', state.url);
  
  const isAuthenticated = await authService.isAuthenticated();
  console.log('¿Usuario autenticado?', isAuthenticated);

  if (!isAuthenticated) {
    console.log('Usuario NO autenticado, redirigiendo a /login');
    await router.navigate(['/login']);
    return false;
  }

  console.log('Usuario autenticado, permitiendo acceso a:', state.url);
  return true;
};
