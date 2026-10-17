import { Component, computed, inject, signal } from '@angular/core';
import { EVENTOS } from '../eventos/eventos.data';
import { ListaEventos } from '../eventos/lista-eventos/lista-eventos';
import { Catalogo } from '../eventos/catalogo/catalogo';
import { Relogio } from '../compartilhado/relogio';
import { situacaoDoEvento } from '../eventos/situacao';

@Component({
  imports: [ListaEventos, Catalogo],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  private readonly agora = inject(Relogio).agora;

  // Os três próximos que ainda não acabaram. Quando um termina, sai sozinho.
  protected readonly destaques = computed(() =>
    EVENTOS.filter((e) => situacaoDoEvento(e, this.agora()) !== 'encerrado')
      .toSorted((a, b) => a.inicioEm.localeCompare(b.inicioEm))
      .slice(0, 3),
  );
}
