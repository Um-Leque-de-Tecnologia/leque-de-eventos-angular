import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ORGANIZADORES } from '../organizadores.data';
import { PerfilOrganizador } from './perfil-organizador';

describe('PerfilOrganizador', () => {
  let component: PerfilOrganizador;
  let fixture: ComponentFixture<PerfilOrganizador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilOrganizador],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilOrganizador);
    component = fixture.componentInstance;
    // na aplicação, quem preenche o slug é a rota; no teste, somos nós
    fixture.componentRef.setInput('slug', ORGANIZADORES[0].slug);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
