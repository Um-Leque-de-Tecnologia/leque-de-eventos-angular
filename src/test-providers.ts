import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { API_URL } from './app/api';

// Entra em TODO teste, antes do providers de cada um. O teste monta o
// componente sozinho, sem o app.config.ts — e quem tem routerLink precisa
// de um router, mesmo que sem rota nenhuma.
export default [
  provideRouter([]),
  // No teste, nenhum pedido sai para a rede: o HttpTestingController segura
  // cada um, e o teste decide o que a "API" responde.
  provideHttpClient(),
  provideHttpClientTesting(),
  { provide: API_URL, useValue: '/api' },
];
