import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EVENTO_DE_TESTE, ORGANIZADOR_DE_TESTE } from '../../testes/exemplos';
import { FormularioEvento } from './formulario-evento';

// Teste de componente: faz o que a pessoa faz (digita, clica) e olha a tela.
describe('FormularioEvento', () => {
  let fixture: ComponentFixture<FormularioEvento>;
  let http: HttpTestingController;
  let navegar: ReturnType<typeof vi.spyOn>;

  const tela = (): HTMLElement => fixture.nativeElement;

  function digitar(id: string, valor: string): void {
    const campo = tela().querySelector<HTMLInputElement | HTMLSelectElement>(`#${id}`)!;
    campo.value = valor;
    campo.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Preenche tudo o que o schema cobra. O que importa em cada teste, ele muda depois.
  async function preencher(): Promise<void> {
    digitar('titulo', 'Um evento de teste');
    digitar('resumo', 'Um resumo que passa na regra.');
    digitar('descricao', 'Uma descrição grande o bastante para passar.');
    digitar('organizador', ORGANIZADOR_DE_TESTE.slug);
    digitar('categoria', 'Dados');
    digitar('inicio', '2099-01-01T10:00');
    digitar('cidade', 'Recife');
    await fixture.whenStable();
    // O validador do endereço espera a pessoa parar de digitar (400 ms), e pergunta.
    await new Promise((r) => setTimeout(r, 450));
    http.expectOne('/api/eventos/um-evento-de-teste').flush({}, { status: 404, statusText: 'Livre' });
    await fixture.whenStable();
  }

  // O envio é uma Promise: depois que a "API" responde, ela ainda precisa de uma
  // volta para terminar, antes de a tela mudar.
  async function assentar(): Promise<void> {
    await new Promise((r) => setTimeout(r));
    await fixture.whenStable();
  }

  async function enviar(): Promise<void> {
    tela().querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    await fixture.whenStable();
  }

  // Abre a tela e responde o pedido da lista de organizadores.
  async function abrir(slug?: string): Promise<void> {
    fixture = TestBed.createComponent(FormularioEvento);
    if (slug) fixture.componentRef.setInput('slug', slug);
    fixture.detectChanges();
    http.expectOne('/api/organizadores').flush([ORGANIZADOR_DE_TESTE]);
    if (slug) http.expectOne(`/api/eventos/${slug}`).flush(EVENTO_DE_TESTE);
    await assentar();
  }

  beforeEach(() => {
    http = TestBed.inject(HttpTestingController);
    // Sem rotas no teste: basta saber para onde ele quis ir.
    navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });

  afterEach(() => http.verify());

  it('enviar vazio mostra as mensagens, leva o foco, e não pede nada à API', async () => {
    await abrir();

    await enviar();

    expect(tela().textContent).toContain('Dê um título ao evento.');
    expect(tela().querySelector('#titulo')!.getAttribute('aria-invalid')).toBe('true');
    expect(document.activeElement?.id).toBe('titulo');
  });

  it('a cidade só aparece, e só é cobrada, quando o evento não é online', async () => {
    await abrir();
    expect(tela().querySelector('#cidade')).not.toBeNull();

    digitar('formato', 'Online');
    await fixture.whenStable();

    expect(tela().querySelector('#cidade')).toBeNull();
  });

  it('com tudo válido, publica e vai para o evento', async () => {
    await abrir();
    await preencher();

    await enviar();
    const pedido = http.expectOne('/api/eventos');
    expect(pedido.request.method).toBe('POST');
    expect(pedido.request.body.titulo).toBe('Um evento de teste');
    expect(pedido.request.body.slug).toBe('um-evento-de-teste');
    pedido.flush(EVENTO_DE_TESTE);
    await assentar();

    expect(navegar).toHaveBeenCalledWith(['/eventos', EVENTO_DE_TESTE.slug]);
  });

  it('o erro que a API devolve para um campo aparece embaixo dele', async () => {
    await abrir();
    await preencher();

    await enviar();
    http.expectOne('/api/eventos').flush(
      { erro: 'Há campos para corrigir.', status: 422, campos: { resumo: 'A API não aceitou este resumo.' } },
      { status: 422, statusText: 'Unprocessable' },
    );
    await assentar();

    expect(tela().textContent).toContain('A API não aceitou este resumo.');
    expect(navegar).not.toHaveBeenCalled();
  });

  it('uma falha de rede avisa, e o envio pode ser tentado de novo', async () => {
    await abrir();
    await preencher();

    await enviar();
    http.expectOne('/api/eventos').flush({ erro: 'fora' }, { status: 500, statusText: 'Erro' });
    await assentar();
    expect(tela().querySelector('[role="alert"]')!.textContent).toContain('Não deu para salvar');

    await enviar();
    http.expectOne('/api/eventos').flush(EVENTO_DE_TESTE);
    await assentar();
    expect(navegar).toHaveBeenCalled();
  });

  it('com slug, abre preenchido e salva com PUT', async () => {
    await abrir(EVENTO_DE_TESTE.slug);
    expect(tela().querySelector('h1')!.textContent).toBe('Editar evento');
    expect(tela().querySelector<HTMLInputElement>('#titulo')!.value).toBe(EVENTO_DE_TESTE.titulo);

    await enviar();
    const pedido = http.expectOne(`/api/eventos/${EVENTO_DE_TESTE.slug}`);
    expect(pedido.request.method).toBe('PUT');
    pedido.flush(EVENTO_DE_TESTE);
    await assentar();

    expect(navegar).toHaveBeenCalledWith(['/eventos', EVENTO_DE_TESTE.slug]);
  });
});
