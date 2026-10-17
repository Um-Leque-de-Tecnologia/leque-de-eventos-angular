import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaEventos } from './lista-eventos';
import { EVENTOS } from '../eventos.data';

describe('ListaEventos', () => {
  let component: ListaEventos;
  let fixture: ComponentFixture<ListaEventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaEventos],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaEventos);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('eventos', EVENTOS);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
