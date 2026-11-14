import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import type { Evento } from './eventos/tipos';
import { ORGANIZADORES } from './organizadores/organizadores.data';

// Um evento só do teste: o teste não depende dos dados de ninguém.
const EVENTO: Evento = {
  id: 't1',
  slug: 'evento-de-teste',
  titulo: 'Evento de teste',
  resumo: 'Um resumo.',
  descricao: 'Uma descrição.',
  organizador: 'Turma',
  organizadorSlug: 'turma',
  categoria: 'Front-end',
  formato: 'Online',
  inicioEm: '2026-11-14T10:00',
  duracaoMin: 90,
  gratuito: true,
  vagas: null,
  nivel: 'Iniciante',
};

// Espera alguém pedir a URL e responde por ela. O pedido sai depois de
// carregar a rota lazy, então ele pode demorar alguns instantes a aparecer.
async function responder(url: string, corpo: object, opcoes?: { status: number; statusText: string }) {
  const http = TestBed.inject(HttpTestingController);
  for (let i = 0; i < 100; i++) {
    const pedidos = http.match(url);
    if (pedidos.length > 0) {
      for (const pedido of pedidos) pedido.flush(corpo, opcoes);
      return;
    }
    await new Promise((r) => setTimeout(r, 10));
  }
  throw new Error(`Ninguém pediu ${url}`);
}

// Navega de verdade, com as rotas da aplicação, e olha o que apareceu.
describe('rotas', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())],
    });
    harness = await RouterTestingHarness.create();
  });

  const h1 = () => harness.routeNativeElement?.querySelector('h1')?.textContent;

  it('/ abre a home', async () => {
    await harness.navigateByUrl('/');
    expect(h1()).toContain('Eventos de tecnologia');
  });

  it('/eventos/:slug de um evento que existe abre o evento, com o título na aba', async () => {
    const navegacao = harness.navigateByUrl(`/eventos/${EVENTO.slug}`);
    await responder(`/api/eventos/${EVENTO.slug}`, EVENTO); // o resolver do título
    await navegacao;
    await responder(`/api/eventos/${EVENTO.slug}`, EVENTO); // o httpResource do detalhe
    await responder('/api/eventos?categoria=Front-end', []); // os da mesma área
    await harness.fixture.whenStable();
    expect(h1()).toBe(EVENTO.titulo);
    expect(TestBed.inject(Title).getTitle()).toBe(`${EVENTO.titulo} · Leque de Eventos`);
  });

  it('/eventos/:slug que a API responde com 404 mostra a página de não encontrada', async () => {
    const naoAchou = { status: 404, statusText: 'Not Found' };
    const navegacao = harness.navigateByUrl('/eventos/esse-evento-nao-existe');
    await responder('/api/eventos/esse-evento-nao-existe', { erro: 'não existe' }, naoAchou);
    await navegacao;
    await responder('/api/eventos/esse-evento-nao-existe', { erro: 'não existe' }, naoAchou);
    await harness.fixture.whenStable();
    expect(h1()).toBe('Página não encontrada');
    expect(TestBed.inject(Title).getTitle()).toBe('Página não encontrada · Leque de Eventos');
  });

  it('/organizadores/:slug abre o organizador', async () => {
    const organizador = ORGANIZADORES[0];
    const navegacao = harness.navigateByUrl(`/organizadores/${organizador.slug}`);
    await responder(`/api/organizadores/${organizador.slug}`, organizador); // o resolver do título
    await navegacao;
    await responder(`/api/organizadores/${organizador.slug}`, organizador); // o perfil
    await responder(`/api/organizadores/${organizador.slug}/eventos`, [EVENTO]); // os eventos dele
    await harness.fixture.whenStable();
    expect(h1()).toBe(organizador.nome);
  });
});
