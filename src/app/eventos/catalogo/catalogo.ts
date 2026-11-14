import { Component, computed, linkedSignal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { Aviso } from '../../compartilhado/aviso/aviso';
import { EVENTOS } from '../eventos.data';
import { aplicarFiltros, cidadesDoFormato } from '../filtros';
import { FiltrosEventos } from '../filtros-eventos/filtros-eventos';
import { ListaEventos } from '../lista-eventos/lista-eventos';
import type { Formato } from '../tipos';

@Component({
  imports: [FiltrosEventos, ListaEventos, Aviso],
  selector: 'app-catalogo',
  styleUrl: './catalogo.css',
  templateUrl: './catalogo.html',
})
export class Catalogo {
  // O estado dos filtros mora AQUI. O FiltrosEventos só edita, via model().
  protected readonly busca = signal('');
  protected readonly formato = signal<Formato | 'todos'>('todos');
  protected readonly soGratuitos = signal(false);

  // A busca que a lista usa: a mesma, só que espera 300 ms sem digitação.
  // Signal → Observable (debounceTime é RxJS) → Signal de novo.
  private readonly buscaAdiada = toSignal(toObservable(this.busca).pipe(debounceTime(300)), {
    initialValue: '',
  });

  // As opções do select de cidade dependem do formato escolhido.
  protected readonly cidades = computed(() => cidadesDoFormato(EVENTOS, this.formato()));

  // A cidade escolhida acompanha as opções: se ela some da lista, volta para
  // "todas"; se continua lá, fica. E a pessoa ainda pode escolher (set).
  protected readonly cidade = linkedSignal({
    source: this.cidades,
    computation: (cidades, anterior): string =>
      anterior && cidades.includes(anterior.value) ? anterior.value : '',
  });

  protected readonly visiveis = computed(() => {
    return aplicarFiltros(EVENTOS, {
      busca: this.buscaAdiada(),
      formato: this.formato(),
      cidade: this.cidade(),
      soGratuitos: this.soGratuitos(),
    });
  });

  // Um computed em cima de outro: muda só quando a lista visível muda.
  protected readonly resumo = computed(() => {
    const total = this.visiveis().length;
    if (total === 0) return 'Nenhum evento encontrado';
    if (total === 1) return '1 evento encontrado';
    return `${total} eventos encontrados`;
  });

  protected limparFiltros(): void {
    this.busca.set('');
    this.formato.set('todos');
    this.cidade.set('');
    this.soGratuitos.set(false);
  }
}
