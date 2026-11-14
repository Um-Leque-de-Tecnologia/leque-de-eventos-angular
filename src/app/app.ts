import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Carregando } from './compartilhado/carregando';
import { Cabecalho } from './layout/cabecalho/cabecalho';
import { Rodape } from './layout/rodape/rodape';

@Component({
  imports: [RouterOutlet, Cabecalho, Rodape],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  private readonly pedidos = inject(Carregando);

  // A faixa aparece em dois casos: uma navegação em andamento (o arquivo de
  // uma rota lazy chegando) ou um pedido à API em andamento (o interceptor).
  protected readonly carregando = computed(
    () => this.router.currentNavigation() !== null || this.pedidos.algum(),
  );
}
