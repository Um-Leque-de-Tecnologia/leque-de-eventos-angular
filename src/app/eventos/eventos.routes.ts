import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { API_URL } from '../api';
import { Catalogo } from './catalogo/catalogo';
import { DetalheEvento } from './detalhe-evento/detalhe-evento';
import type { Evento } from './tipos';

// Resolver: roda antes de a página abrir e entrega o título da aba. O título
// agora está na API — e o resolver pode devolver um Observable: o router espera.
const tituloDoEvento: ResolveFn<string> = (rota) =>
  inject(HttpClient)
    .get<Evento>(`${inject(API_URL)}/eventos/${rota.paramMap.get('slug')}`)
    .pipe(
      map((evento) => `${evento.titulo} · Leque de Eventos`),
      // 404: o evento não existe. Qualquer outra falha: não se sabe qual é.
      catchError((erro) =>
        of(
          erro instanceof HttpErrorResponse && erro.status === 404
            ? 'Página não encontrada · Leque de Eventos'
            : 'Evento · Leque de Eventos',
        ),
      ),
    );

// O formulário trouxe a biblioteca de Signal Forms, e só quem vai publicar precisa
// dela. import() no lugar do import lá de cima: vira um arquivo à parte, baixado
// quando alguém abre a rota. Quem só procura evento não paga por ele.
const formulario = () => import('./formulario-evento/formulario-evento').then((m) => m.FormularioEvento);

// As rotas filhas de /eventos. O path aqui é o que vem DEPOIS de /eventos:
// '' é o próprio /eventos, e ':slug' é qualquer coisa depois da barra.
// O guard eventoExiste saiu: quem sabe se o evento existe agora é a API, e o
// detalhe mostra a página de não encontrada quando ela responde 404.
export default [
  { path: '', component: Catalogo, title: 'Eventos · Leque de Eventos' },
  // ANTES do ':slug'. O router para na primeira que serve, e ':slug' serve para
  // qualquer coisa: depois dele, /eventos/novo seria um evento chamado "novo".
  { path: 'novo', loadComponent: formulario, title: 'Publicar evento · Leque de Eventos' },
  // O mesmo componente: o :slug chega nele como input, como no detalhe.
  { path: ':slug/editar', loadComponent: formulario, title: 'Editar evento · Leque de Eventos' },
  { path: ':slug', component: DetalheEvento, title: tituloDoEvento },
] satisfies Routes;
