import { CanMatchFn, ResolveFn, Routes } from '@angular/router';
import { ORGANIZADORES } from './organizadores.data';
import { PerfilOrganizador } from './perfil-organizador/perfil-organizador';

// O mesmo guard dos eventos, agora com a lista de organizadores.
const organizadorExiste: CanMatchFn = (_rota, segmentos) =>
  ORGANIZADORES.some((o) => o.slug === segmentos[0]?.path);

const tituloDoOrganizador: ResolveFn<string> = (rota) => {
  const organizador = ORGANIZADORES.find((o) => o.slug === rota.paramMap.get('slug'));
  return `${organizador?.nome ?? 'Organizador'} · Leque de Eventos`;
};

export default [
  // Não existe página com todos os organizadores — o briefing não pede. Sem
  // esta linha, /organizadores sozinho abre uma página em branco.
  { path: '', redirectTo: '/eventos', pathMatch: 'full' },
  { path: ':slug', component: PerfilOrganizador, canMatch: [organizadorExiste], title: tituloDoOrganizador },
] satisfies Routes;
