import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Aviso } from '../../compartilhado/aviso/aviso';
import { EVENTOS } from '../../eventos/eventos.data';
import { ListaEventos } from '../../eventos/lista-eventos/lista-eventos';
import { ORGANIZADORES } from '../organizadores.data';

@Component({
  imports: [RouterLink, ListaEventos, Aviso],
  selector: 'app-perfil-organizador',
  styleUrl: './perfil-organizador.css',
  templateUrl: './perfil-organizador.html',
})
export class PerfilOrganizador {
  // O mesmo desenho do detalhe: o :slug do endereço chega como input.
  readonly slug = input.required<string>();

  protected readonly organizador = computed(() => ORGANIZADORES.find((o) => o.slug === this.slug()));

  // Os eventos de quem organiza, do mais próximo para o mais distante.
  protected readonly eventos = computed(() =>
    EVENTOS.filter((e) => e.organizadorSlug === this.slug()).toSorted((a, b) =>
      a.inicioEm.localeCompare(b.inicioEm),
    ),
  );
}
