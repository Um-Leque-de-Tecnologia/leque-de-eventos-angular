import { Routes } from '@angular/router';
import { ErroDeCarregamento } from './erro-de-carregamento/erro-de-carregamento';
import { Inicio } from './inicio/inicio';
import { NaoEncontrada } from './nao-encontrada/nao-encontrada';

// Cada endereço, uma página. O router lê de cima para baixo e para na
// primeira rota que serve. O title é o texto da aba do navegador.
export const routes: Routes = [
  { path: '', component: Inicio, title: 'Leque de Eventos' },
  // Tudo o que começa com /eventos mora num arquivo à parte, baixado só
  // quando alguém entra lá. As rotas de dentro estão em eventos.routes.ts.
  { path: 'eventos', loadChildren: () => import('./eventos/eventos.routes') },
  { path: 'organizadores', loadChildren: () => import('./organizadores/organizadores.routes') },
  // Para onde o app.config.ts manda quando uma página não consegue abrir.
  { path: 'erro', component: ErroDeCarregamento, title: 'Não foi possível abrir a página · Leque de Eventos' },
  // '**' serve para qualquer endereço. Por isso é a ÚLTIMA: só chega aqui o
  // que nenhuma rota de cima quis.
  { path: '**', component: NaoEncontrada, title: 'Página não encontrada · Leque de Eventos' },
];
