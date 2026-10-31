import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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

  protected readonly carregando = computed(() => this.router.currentNavigation() !== null);
}
