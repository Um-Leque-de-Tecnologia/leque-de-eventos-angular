import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErroDeCarregamento } from './erro-de-carregamento';

describe('ErroDeCarregamento', () => {
  let component: ErroDeCarregamento;
  let fixture: ComponentFixture<ErroDeCarregamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErroDeCarregamento],
    }).compileComponents();

    fixture = TestBed.createComponent(ErroDeCarregamento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
