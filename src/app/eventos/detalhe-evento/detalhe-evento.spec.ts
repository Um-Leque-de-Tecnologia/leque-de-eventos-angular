import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, DeferBlockBehavior, DeferBlockState, TestBed } from '@angular/core/testing';
import { EVENTO_DE_TESTE } from '../../testes/exemplos';
import { DetalheEvento } from './detalhe-evento';

describe('DetalheEvento', () => {
  let component: DetalheEvento;
  let fixture: ComponentFixture<DetalheEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheEvento],
      // O teste decide quando o @defer anda: nada de esperar a rolagem.
      deferBlockBehavior: DeferBlockBehavior.Manual,
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheEvento);
    component = fixture.componentInstance;
    // na aplicação, quem preenche o slug é a rota; no teste, somos nós
    fixture.componentRef.setInput('slug', EVENTO_DE_TESTE.slug);
    // whenStable() esperaria o pedido à API — que no teste ninguém responde.
    // detectChanges() desenha uma vez e segue.
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('só pede os relacionados quando o @defer abre', async () => {
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(`/api/eventos/${EVENTO_DE_TESTE.slug}`).flush(EVENTO_DE_TESTE);
    await fixture.whenStable();

    // O evento chegou, e o bloco está no placeholder: nenhum pedido a mais.
    http.expectNone('/api/eventos?categoria=Front-end');
    expect(fixture.nativeElement.textContent).toContain('aparecem aqui');

    const [bloco] = await fixture.getDeferBlocks();
    await bloco.render(DeferBlockState.Complete);

    http
      .expectOne('/api/eventos?categoria=Front-end')
      .flush([{ ...EVENTO_DE_TESTE, slug: 'outro', id: 't2', titulo: 'Outro evento' }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Outro evento');
  });
});
