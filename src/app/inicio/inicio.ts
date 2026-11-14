import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Relogio } from '../compartilhado/relogio';
import { EVENTOS } from '../eventos/eventos.data';
import { ListaEventos } from '../eventos/lista-eventos/lista-eventos';
import { situacaoDoEvento } from '../eventos/situacao';

@Component({
  imports: [ListaEventos, RouterLink],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  // O mesmo relógio dos cards: a home e o catálogo concordam sobre "agora".
  private readonly agora = inject(Relogio).agora;

  // Os três próximos que ainda não acabaram. Quando um termina, sai sozinho.
  protected readonly destaques = computed(() =>
    EVENTOS.filter((e) => situacaoDoEvento(e, this.agora()) !== 'encerrado')
      .toSorted((a, b) => a.inicioEm.localeCompare(b.inicioEm))
      .slice(0, 3),
  );
}
