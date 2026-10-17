import { Component, computed, inject, input } from '@angular/core';
import { Evento } from '../tipos';
import { DatePipe } from '@angular/common';
import { Relogio } from '../../compartilhado/relogio';
import { situacaoDoEvento } from '../situacao';

@Component({
  imports: [DatePipe],
  selector: 'app-card-evento',
  styleUrl: './card-evento.css',
  templateUrl: './card-evento.html',
})
export class CardEvento {
  readonly evento = input.required<Evento>();

  private readonly agora = inject(Relogio).agora;

  protected readonly situacao = computed(() => situacaoDoEvento(this.evento(), this.agora()));
}
