import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Inicio } from './inicio';

describe('Inicio', () => {
  let component: Inicio;
  let fixture: ComponentFixture<Inicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inicio],
    }).compileComponents();

    fixture = TestBed.createComponent(Inicio);
    component = fixture.componentInstance;
    // whenStable() esperaria o pedido à API — que no teste ninguém responde.
    // detectChanges() desenha uma vez e segue.
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
