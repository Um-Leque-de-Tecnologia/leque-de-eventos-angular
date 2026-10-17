import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-aviso',
  styleUrl: './aviso.css',
  templateUrl: './aviso.html',
})
export class Aviso {
  readonly icone = input('ℹ️');
  // Sem rótulo, sem botão: nem todo aviso tem o que fazer.
  readonly acao = input<string>();
  // O aviso não sabe O QUE a ação faz. Ele só avisa que clicaram.
  readonly agir = output<void>();
}
