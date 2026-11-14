import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Relogio } from '../../compartilhado/relogio';
import { situacaoDoEvento } from '../situacao';
import type { Evento } from '../tipos';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-card-evento',
  styleUrl: './card-evento.css',
  templateUrl: './card-evento.html',
})
export class CardEvento {
  // required: sem evento não existe card. O TypeScript cobra de quem usa.
  readonly evento = input.required<Evento>();

  // inject(): pede a instância única do relógio. Todo card recebe a mesma.
  private readonly agora = inject(Relogio).agora;

  // Depende de dois signals: o evento (input) e a hora (relógio).
  protected readonly situacao = computed(() => situacaoDoEvento(this.evento(), this.agora()));
}
