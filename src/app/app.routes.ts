import { CanActivateFn, Router, Routes } from '@angular/router';

import { inject } from '@angular/core';
import { authenticatedRoutes } from './pages/authenticated/authenticated.routes';
import { LoginComponent } from './pages/login/login.component';
export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const queryParams = route.queryParams;
  const accessToken = queryParams['access_token'];

  if (!(accessToken || localStorage.getItem('access_token'))) {
    router.navigate(['/login']);
    return false;
  }
  if (localStorage.getItem('access_token')) {
    return true;
  }
  localStorage.setItem('access_token', accessToken);
  return true;
};
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: authenticatedRoutes,
  },
  { path: '**', redirectTo: '' },
];
