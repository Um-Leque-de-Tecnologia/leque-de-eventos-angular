import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltrosEventos } from './filtros-eventos';

describe('FiltrosEventos', () => {
  let component: FiltrosEventos;
  let fixture: ComponentFixture<FiltrosEventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosEventos],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltrosEventos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
