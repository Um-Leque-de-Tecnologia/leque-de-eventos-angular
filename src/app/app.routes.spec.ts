import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { EVENTOS } from './eventos/eventos.data';
import { ORGANIZADORES } from './organizadores/organizadores.data';

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
    const evento = EVENTOS[0];
    await harness.navigateByUrl(`/eventos/${evento.slug}`);
    expect(h1()).toBe(evento.titulo);
    expect(TestBed.inject(Title).getTitle()).toBe(`${evento.titulo} · Leque de Eventos`);
  });

  it('/eventos/:slug de um evento que não existe cai na 404', async () => {
    await harness.navigateByUrl('/eventos/esse-evento-nao-existe');
    expect(h1()).toBe('Página não encontrada');
  });

  it('/organizadores/:slug abre o organizador', async () => {
    const organizador = ORGANIZADORES[0];
    await harness.navigateByUrl(`/organizadores/${organizador.slug}`);
    expect(h1()).toBe(organizador.nome);
  });
});
