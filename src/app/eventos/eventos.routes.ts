import { CanMatchFn, ResolveFn, Routes } from '@angular/router';
import { Catalogo } from './catalogo/catalogo';
import { DetalheEvento } from './detalhe-evento/detalhe-evento';
import { EVENTOS } from './eventos.data';

// Guard: "esta rota serve para este endereço?". Para um slug que não é de
// nenhum evento, a resposta é não — e o router segue procurando, até o '**'.
const eventoExiste: CanMatchFn = (_rota, segmentos) =>
  EVENTOS.some((e) => e.slug === segmentos[0]?.path);

// Resolver: roda antes de a página abrir e entrega um valor para a rota.
// Aqui, o título da aba, que depende de qual evento é.
const tituloDoEvento: ResolveFn<string> = (rota) => {
  const evento = EVENTOS.find((e) => e.slug === rota.paramMap.get('slug'));
  return `${evento?.titulo ?? 'Evento'} · Leque de Eventos`;
};

// As rotas filhas de /eventos. O path aqui é o que vem DEPOIS de /eventos:
// '' é o próprio /eventos, e ':slug' é qualquer coisa depois da barra.
export default [
  { path: '', component: Catalogo, title: 'Eventos · Leque de Eventos' },
  { path: ':slug', component: DetalheEvento, canMatch: [eventoExiste], title: tituloDoEvento },
] satisfies Routes;
