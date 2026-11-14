import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Catalogo } from './catalogo';

describe('Catalogo', () => {
  let fixture: ComponentFixture<Catalogo>;
  let http: HttpTestingController;
  const texto = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Catalogo],
    }).compileComponents();

    fixture = TestBed.createComponent(Catalogo);
    http = TestBed.inject(HttpTestingController);
    // whenStable() aqui esperaria o pedido à API, que ninguém respondeu ainda.
    fixture.detectChanges();
  });

  it('mostra "Carregando" enquanto a API não responde', () => {
    expect(texto()).toContain('Carregando os eventos');
  });

  it('quando a API falha, mostra o aviso com "Tentar de novo"', async () => {
    http.expectOne('/api/eventos').flush('erro', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();
    expect(texto()).toContain('Não deu para carregar os eventos');
    expect(texto()).toContain('Tentar de novo');
  });
});
