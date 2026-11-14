import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { ApplicationConfig, inject, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  RedirectCommand,
  Router,
  withComponentInputBinding,
  withInMemoryScrolling,
  withNavigationErrorHandler,
} from '@angular/router';
import { environment } from '../environments/environment';
import { API_URL } from './api';
import { routes } from './app.routes';
import { carregandoInterceptor } from './compartilhado/carregando.interceptor';

// Ensina o Angular a escrever datas em português ("8 de outubro").
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // o :slug da rota vira o input slug da página
      withComponentInputBinding(),
      // página nova começa no topo; o Voltar devolve a pessoa onde ela estava
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      // se a navegação falhar (o arquivo da rota não chegou, por exemplo),
      // mostra a página de erro — sem trocar o endereço na barra
      withNavigationErrorHandler(
        () => new RedirectCommand(inject(Router).parseUrl('/erro'), { skipLocationChange: true }),
      ),
    ),
    // O HttpClient já existe sem isto, no Angular 22. O provideHttpClient só
    // entra para CONFIGURAR — aqui, para pôr o interceptor no caminho.
    provideHttpClient(withInterceptors([carregandoInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    // Quem pedir API_URL recebe o endereço do environment (um no ng serve, outro
    // no ng build). O teste diz outro (src/test-providers.ts).
    { provide: API_URL, useValue: environment.apiUrl },
  ],
};
