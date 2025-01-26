// src/app/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn(); // Verifica se o usuário está logado

  // Rota de login: redireciona se o usuário estiver logado
  if (route.routeConfig?.path === 'auth') {
    if (isLoggedIn) {
      router.navigate(['/app']);
      return false; // Bloqueia o acesso à rota de login
    }
    return true; // Permite acesso à rota de login
  }

  // Outras rotas: redireciona se o usuário não estiver logado
  if (!isLoggedIn) {
    router.navigate(['/auth']);
    return false; // Bloqueia o acesso à rota
  }

  return true; // Permite o acesso à rota
};
