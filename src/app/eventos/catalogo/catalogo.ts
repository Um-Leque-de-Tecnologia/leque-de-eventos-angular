import { httpResource } from '@angular/common/http';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { API_URL } from '../../api';
import { Aviso } from '../../compartilhado/aviso/aviso';
import { aplicarFiltros, cidadesDoFormato } from '../filtros';
import { FiltrosEventos } from '../filtros-eventos/filtros-eventos';
import { ListaEventos } from '../lista-eventos/lista-eventos';
import type { Evento, Formato } from '../tipos';

@Component({
  imports: [FiltrosEventos, ListaEventos, Aviso],
  selector: 'app-catalogo',
  styleUrl: './catalogo.css',
  templateUrl: './catalogo.html',
})
export class Catalogo {
  private readonly api = inject(API_URL);

  // Os eventos agora vêm da API. httpResource é um signal que sabe esperar:
  // value(), isLoading(), error() — e um reload() para tentar de novo.
  // defaultValue: enquanto a resposta não chega, a lista é vazia, e não
  // undefined — o resto do componente não precisa de "?" em todo lugar.
  protected readonly eventos = httpResource<Evento[]>(() => `${this.api}/eventos`, {
    defaultValue: [],
  });

  // A lista que o resto do componente lê. Em estado de erro, value() LANÇA
  // em vez de devolver alguma coisa — então pergunta antes, com hasValue().
  private readonly todos = computed(() => (this.eventos.hasValue() ? this.eventos.value() : []));

  // O estado dos filtros mora AQUI. O FiltrosEventos só edita, via model().
  protected readonly busca = signal('');
  protected readonly formato = signal<Formato | 'todos'>('todos');
  protected readonly soGratuitos = signal(false);

  // A busca que a lista usa: a mesma, só que espera 300 ms sem digitação.
  // Signal → Observable (debounceTime é RxJS) → Signal de novo.
  private readonly buscaAdiada = toSignal(toObservable(this.busca).pipe(debounceTime(300)), {
    initialValue: '',
  });

  // As opções do select de cidade dependem do formato escolhido — e dos
  // eventos que chegaram. Quando a resposta chega, a conta se refaz sozinha.
  protected readonly cidades = computed(() => cidadesDoFormato(this.todos(), this.formato()));

  // A cidade escolhida acompanha as opções: se ela some da lista, volta para
  // "todas"; se continua lá, fica. E a pessoa ainda pode escolher (set).
  protected readonly cidade = linkedSignal({
    source: this.cidades,
    computation: (cidades, anterior): string =>
      anterior && cidades.includes(anterior.value) ? anterior.value : '',
  });

  // Derivado: o mesmo de antes. Só trocou o EVENTOS fixo pela lista que chegou.
  protected readonly visiveis = computed(() => {
    return aplicarFiltros(this.todos(), {
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
