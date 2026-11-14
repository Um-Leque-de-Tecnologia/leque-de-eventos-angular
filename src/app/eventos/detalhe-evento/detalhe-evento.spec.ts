import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EVENTOS } from '../eventos.data';
import { DetalheEvento } from './detalhe-evento';

describe('DetalheEvento', () => {
  let component: DetalheEvento;
  let fixture: ComponentFixture<DetalheEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheEvento],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheEvento);
    component = fixture.componentInstance;
    // na aplicação, quem preenche o slug é a rota; no teste, somos nós
    fixture.componentRef.setInput('slug', EVENTOS[0].slug);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
