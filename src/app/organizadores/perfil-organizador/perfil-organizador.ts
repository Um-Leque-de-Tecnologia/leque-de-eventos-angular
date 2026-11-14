import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { API_URL } from '../../api';
import { Aviso } from '../../compartilhado/aviso/aviso';
import { ListaEventos } from '../../eventos/lista-eventos/lista-eventos';
import type { Evento } from '../../eventos/tipos';
import { NaoEncontrada } from '../../nao-encontrada/nao-encontrada';
import type { Organizador } from '../organizador';

@Component({
  imports: [RouterLink, ListaEventos, Aviso, NaoEncontrada],
  selector: 'app-perfil-organizador',
  styleUrl: './perfil-organizador.css',
  templateUrl: './perfil-organizador.html',
})
export class PerfilOrganizador {
  private readonly api = inject(API_URL);

  // O mesmo desenho do detalhe: o :slug do endereço chega como input.
  readonly slug = input.required<string>();

  // Duas buscas, as duas presas ao mesmo slug.
  protected readonly organizador = httpResource<Organizador>(() => `${this.api}/organizadores/${this.slug()}`);
  private readonly doOrganizador = httpResource<Evento[]>(
    () => `${this.api}/organizadores/${this.slug()}/eventos`,
    { defaultValue: [] },
  );

  protected readonly atual = computed(() =>
    this.organizador.hasValue() ? this.organizador.value() : undefined,
  );

  protected readonly naoExiste = computed(() => {
    const erro = this.organizador.error();
    return erro instanceof HttpErrorResponse && erro.status === 404;
  });

  // A API já devolve do mais próximo para o mais distante.
  protected readonly eventos = computed(() =>
    this.doOrganizador.hasValue() ? this.doOrganizador.value() : [],
  );

  // As duas buscas caíram juntas: as duas tentam de novo juntas.
  protected recarregar(): void {
    this.organizador.reload();
    this.doOrganizador.reload();
  }
}
