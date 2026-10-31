import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { NaoEncontrada } from './nao-encontrada/nao-encontrada';
import { ErroDeCarregamento } from './erro-de-carregamento/erro-de-carregamento';

export const routes: Routes = [
  { path: '', component: Inicio,  title: 'Leque de Eventos'  },
  { path: 'eventos', loadChildren: () => import('./eventos/eventos.routes')},
   { path: 'organizadores', loadChildren: () => import('./organizadores/organizadores.routes') },
  { path: 'erro', component: ErroDeCarregamento, title: 'Não foi possível abrir a página · Leque de Eventos' },
   { path: '**', component: NaoEncontrada, title: 'Página não encontrada · Leque de Eventos'  },
];
