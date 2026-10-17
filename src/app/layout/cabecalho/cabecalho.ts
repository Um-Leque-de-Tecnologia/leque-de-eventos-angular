import { Component, effect, signal } from '@angular/core';

type Tema = 'light' | 'dark';

function temaSalvo(): Tema | null {
  const valor = localStorage.getItem('tema');
  return valor === 'light' || valor === 'dark' ? valor : null;
}

@Component({
  imports: [],
  selector: 'app-cabecalho',
  styleUrl: './cabecalho.css',
  templateUrl: './cabecalho.html',
})
export class Cabecalho {
  // null = a pessoa ainda não escolheu, e o CSS segue o prefers-color-scheme
  protected readonly tema = signal<Tema | null>(temaSalvo());

  constructor() {
    effect(() => {
      const tema = this.tema();
      if (!tema) return;
      document.documentElement.dataset['tema'] = tema;
      localStorage.setItem('tema', tema);
    });
  }

  protected alternarTema(): void {
    this.tema.update((atual) => (atual === 'dark' ? 'light' : 'dark'));
  }
}
