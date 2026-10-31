import { CanMatchFn, ResolveFn, Routes } from '@angular/router';
import { Catalogo } from './catalogo/catalogo';
import { DetalheEvento } from './detalhe-evento/detalhe-evento';
import { EVENTOS } from './eventos.data';

const eventoExiste: CanMatchFn = (_rota, segmentos) =>
  EVENTOS.some((e) => e.slug === segmentos[0]?.path);

const tituloDoEvento: ResolveFn<string> = (rota) => {
  const evento = EVENTOS.find((e) => e.slug === rota.paramMap.get('slug'));
  return `${evento?.titulo ?? 'Evento'} · Leque de Eventos`;
};
export default [
    { path: '', component: Catalogo, title: 'Eventos · Leque de Eventos' },
    { path: ':slug', component: DetalheEvento, canMatch: [eventoExiste],  title: tituloDoEvento },
] satisfies Routes;