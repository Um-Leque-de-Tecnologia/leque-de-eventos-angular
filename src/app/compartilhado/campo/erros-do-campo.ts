import { Component, computed, input } from '@angular/core';
import type { ReadonlyFieldTree } from '@angular/forms/signals';

// As mensagens de um campo, uma embaixo da outra. Só depois que a pessoa passou
// por ele: ninguém gosta de levar bronca antes de começar a digitar.
@Component({
  selector: 'app-erros-do-campo',
  template: `
    @if (visivel()) {
      <div class="erros" [id]="id()">
        @for (erro of estado().errors(); track erro.kind) {
          <p>{{ erro.message }}</p>
        }
      </div>
    }
  `,
  styles: `
    .erros p {
      margin: 0;
      color: var(--cor-erro);
      font-size: .95em;
    }
  `,
})
export class ErrosDoCampo {
  readonly campo = input.required<ReadonlyFieldTree<unknown>>();

  protected readonly estado = computed(() => this.campo()());
  protected readonly visivel = computed(() => this.estado().touched() && this.estado().invalid());
  // O mesmo id que a diretiva AriaDoCampo põe no aria-describedby do input.
  protected readonly id = computed(() => `erro-${this.estado().name()}`);
}
