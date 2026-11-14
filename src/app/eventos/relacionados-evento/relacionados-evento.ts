import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { API_URL } from '../../api';
import { ListaEventos } from '../lista-eventos/lista-eventos';
import type { Evento } from '../tipos';

// "Mais eventos da mesma área". Saiu do detalhe para virar um bloco próprio: o
// @defer só adia o que é um componente separado.
@Component({
  imports: [ListaEventos],
  selector: 'app-relacionados-evento',
  template: `
    @if (relacionados().length > 0) {
      <section aria-labelledby="tit-relacionados">
        <h2 id="tit-relacionados">Mais eventos de {{ categoria() }}</h2>
        <app-lista-eventos [eventos]="relacionados()" />
      </section>
    }
  `,
})
export class RelacionadosEvento {
  private readonly api = inject(API_URL);

  readonly categoria = input.required<string>();
  readonly slug = input.required<string>(); // o evento aberto, que não entra na lista

  // O pedido nasce com o componente: se ele só aparece quando a pessoa rola até
  // lá, o pedido também só sai nessa hora.
  private readonly daArea = httpResource<Evento[]>(
    () => `${this.api}/eventos?categoria=${encodeURIComponent(this.categoria())}`,
    { defaultValue: [] },
  );

  // Até três eventos da mesma área, tirando este.
  protected readonly relacionados = computed(() =>
    (this.daArea.hasValue() ? this.daArea.value() : []).filter((e) => e.slug !== this.slug()).slice(0, 3),
  );
}
