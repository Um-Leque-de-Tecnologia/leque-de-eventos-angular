import { Component, input } from '@angular/core';
import { Evento } from '../tipos';
import { CardEvento } from '../card-evento/card-evento';

@Component({
  imports: [CardEvento],
  selector: 'app-lista-eventos',
  styleUrl: './lista-eventos.css',
  templateUrl: './lista-eventos.html',
})
export class ListaEventos {
  readonly eventos = input.required<readonly Evento[]>();
}
