import { Component, computed, input, model } from '@angular/core';
import { Formato } from '../tipos';

const OPCOES_FORMATO = ['todos', 'Presencial', 'Online', 'Híbrido'] as const;


@Component({
  imports: [],
  selector: 'app-filtros-eventos',
  styleUrl: './filtros-eventos.css',
  templateUrl: './filtros-eventos.html',
})
export class FiltrosEventos {
  readonly busca = model('');
  readonly formato = model<Formato | 'todos'>('todos');
  readonly cidade = model('');
  readonly soGratuitos = model(false);
  
  protected readonly opcoesFormato = OPCOES_FORMATO;
  readonly cidades = input<readonly string[]>([]);

   protected readonly ativos = computed(() => {
    let total = 0;
    if (this.busca() !== '') total++;
    if (this.formato() !== 'todos') total++;
    if (this.cidade() !== '') total++;
    if (this.soGratuitos()) total++;
    return total;
  });

  protected readonly rotuloLimpar = computed(() =>
    this.ativos() === 0 ? 'Limpar' : `Limpar (${this.ativos()})`,
  );
  
  protected escolherFormato(valor: string): void {
    const opcao = OPCOES_FORMATO.find((o) => o === valor);
    if (opcao) this.formato.set(opcao);
  }

  protected limpar(): void {
    this.busca.set('');
    this.formato.set('todos');
    this.cidade.set('');
    this.soGratuitos.set(false);
  }
}
