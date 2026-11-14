import { httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { API_URL } from '../api';
import { Relogio } from '../compartilhado/relogio';
import { ListaEventos } from '../eventos/lista-eventos/lista-eventos';
import { situacaoDoEvento } from '../eventos/situacao';
import type { Evento } from '../eventos/tipos';

@Component({
  imports: [ListaEventos, RouterLink],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  private readonly api = inject(API_URL);

  // O mesmo relógio dos cards: a home e o catálogo concordam sobre "agora".
  private readonly agora = inject(Relogio).agora;

  // A mesma lista que o catálogo pede. A API já devolve em ordem de data.
  protected readonly eventos = httpResource<Evento[]>(() => `${this.api}/eventos`, {
    defaultValue: [],
  });

  // Os três próximos que ainda não acabaram. Quando um termina, sai sozinho.
  protected readonly destaques = computed(() =>
    (this.eventos.hasValue() ? this.eventos.value() : [])
      .filter((e) => situacaoDoEvento(e, this.agora()) !== 'encerrado')
      .slice(0, 3),
  );
}
