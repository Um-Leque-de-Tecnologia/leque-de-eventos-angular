import { ApplicationConfig, inject, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, RedirectCommand, Router, withComponentInputBinding, withInMemoryScrolling, withNavigationErrorHandler } from '@angular/router';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { environment } from '../environments/environment';
import { API_URL } from './api';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, 
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      withNavigationErrorHandler(
        () => new RedirectCommand(inject(Router).parseUrl('/erro'), { skipLocationChange: true }),
      ),
      ),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: API_URL, useValue: environment.apiUrl},
  ]
};
