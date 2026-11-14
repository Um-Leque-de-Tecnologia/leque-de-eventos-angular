import { computed, Service, signal } from '@angular/core';

// Quantos pedidos à rede estão em andamento agora. Um só para a aplicação
// inteira, como o Relogio: o interceptor conta, e a faixa do App lê.
@Service()
export class Carregando {
  private readonly emAndamento = signal(0);

  readonly algum = computed(() => this.emAndamento() > 0);

  comecou(): void {
    this.emAndamento.update((n) => n + 1);
  }

  terminou(): void {
    this.emAndamento.update((n) => n - 1);
  }
}
