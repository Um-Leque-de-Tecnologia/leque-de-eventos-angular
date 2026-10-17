import { Component, computed, linkedSignal, signal } from '@angular/core';
import { EVENTOS } from '../eventos.data';
import { aplicarFiltros, cidadesDoFormato } from '../filtros';
import { Formato, Evento } from '../tipos';
import { FiltrosEventos } from '../filtros-eventos/filtros-eventos';
import { ListaEventos } from '../lista-eventos/lista-eventos';
import { Aviso } from '../../compartilhado/aviso/aviso';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

@Component({
  imports: [FiltrosEventos, ListaEventos, Aviso],
  selector: 'app-catalogo',
  styleUrl: './catalogo.css',
  templateUrl: './catalogo.html',
})
export class Catalogo {
  protected readonly busca = signal('');
  protected readonly formato = signal<Formato | 'todos'>('todos');
  protected readonly soGratuitos = signal(false);

  private readonly buscaAdiada = toSignal(toObservable(this.busca).pipe(debounceTime(300)), {
    initialValue: '',
  });

  protected readonly cidades = computed(() => cidadesDoFormato(EVENTOS, this.formato()));
  
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
