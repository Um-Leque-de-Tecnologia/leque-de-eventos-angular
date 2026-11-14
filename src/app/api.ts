import { InjectionToken } from '@angular/core';

// O endereço da API, por injeção. Um token, e não uma constante importada:
// quem decide o valor é o app.config.ts — e o teste troca sem mexer em
// componente nenhum.
export const API_URL = new InjectionToken<string>('API_URL');
