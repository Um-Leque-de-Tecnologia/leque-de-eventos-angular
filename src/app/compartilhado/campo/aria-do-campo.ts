import { computed, Directive, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';

// Vermelho não chega ao leitor de tela. Esta diretiva diz, em todo campo do
// formulário, as duas coisas que ele precisa saber: "este campo está errado"
// (aria-invalid) e "a explicação está naquele texto" (aria-describedby).
//
// O seletor é o mesmo do FormField: importou no componente, vale para todo
// elemento com [formField], sem escrever nada em cada um.
@Directive({
  selector: '[formField]',
  host: {
    '[attr.aria-invalid]': 'comErro() ? "true" : null',
    '[attr.aria-describedby]': 'comErro() ? idDoErro() : null',
  },
})
export class AriaDoCampo {
  private readonly campo = inject(FormField);

  protected readonly comErro = computed(() => {
    const estado = this.campo.state();
    return estado.touched() && estado.invalid();
  });
  protected readonly idDoErro = computed(() => `erro-${this.campo.state().name()}`);
}
