import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EVENTO_DE_TESTE } from '../testes/exemplos';
import { EventosApi } from './eventos-api';
import type { EventoNovo } from './tipos';

// Teste de service: nada de tela. Chama o método e confere o pedido que saiu. O
// /api vem do src/test-providers.ts.
describe('EventosApi', () => {
  const { id: _id, organizador: _organizador, ...novo } = EVENTO_DE_TESTE;
  const evento: EventoNovo = novo;

  let api: EventosApi;
  let http: HttpTestingController;

  beforeEach(() => {
    api = TestBed.inject(EventosApi);
    http = TestBed.inject(HttpTestingController);
  });

  // Confere, depois de cada teste, que não saiu nenhum pedido a mais.
  afterEach(() => http.verify());

  it('publicar manda um POST com o evento, e devolve o que a API guardou', async () => {
    const resposta = api.publicar(evento);

    const pedido = http.expectOne('/api/eventos');
    expect(pedido.request.method).toBe('POST');
    expect(pedido.request.body).toEqual(evento);
    pedido.flush(EVENTO_DE_TESTE);

    await expect(resposta).resolves.toEqual(EVENTO_DE_TESTE);
  });

  it('editar manda um PUT no endereço do evento', async () => {
    const resposta = api.editar(evento.slug, evento);

    const pedido = http.expectOne(`/api/eventos/${evento.slug}`);
    expect(pedido.request.method).toBe('PUT');
    pedido.flush(EVENTO_DE_TESTE);

    await expect(resposta).resolves.toEqual(EVENTO_DE_TESTE);
  });

  it('remover manda um DELETE no endereço do evento', async () => {
    const resposta = api.remover(evento.slug);

    const pedido = http.expectOne(`/api/eventos/${evento.slug}`);
    expect(pedido.request.method).toBe('DELETE');
    pedido.flush(null, { status: 204, statusText: 'No Content' });

    await expect(resposta).resolves.toBeNull();
  });

  it('quando a API recusa, a Promise rejeita', async () => {
    const resposta = api.publicar(evento);

    http.expectOne('/api/eventos').flush({ erro: 'fora' }, { status: 500, statusText: 'Erro' });

    await expect(resposta).rejects.toMatchObject({ status: 500 });
  });
});
