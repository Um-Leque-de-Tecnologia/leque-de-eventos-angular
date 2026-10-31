import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
