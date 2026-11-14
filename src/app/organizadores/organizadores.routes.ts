import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { API_URL } from '../api';
import type { Organizador } from './organizador';
import { PerfilOrganizador } from './perfil-organizador/perfil-organizador';

// O mesmo resolver do evento, agora para o organizador.
const tituloDoOrganizador: ResolveFn<string> = (rota) =>
  inject(HttpClient)
    .get<Organizador>(`${inject(API_URL)}/organizadores/${rota.paramMap.get('slug')}`)
    .pipe(
      map((organizador) => `${organizador.nome} · Leque de Eventos`),
      catchError((erro) =>
        of(
          erro instanceof HttpErrorResponse && erro.status === 404
            ? 'Página não encontrada · Leque de Eventos'
            : 'Organizador · Leque de Eventos',
        ),
      ),
    );

export default [
  // Não existe página com todos os organizadores — o briefing não pede. Sem
  // esta linha, /organizadores sozinho abre uma página em branco.
  { path: '', redirectTo: '/eventos', pathMatch: 'full' },
  // O guard saiu, como o dos eventos: quem diz se o organizador existe é a API.
  { path: ':slug', component: PerfilOrganizador, title: tituloDoOrganizador },
] satisfies Routes;
