import { Component, signal } from '@angular/core';

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
    const salvo = this.tema();
    if (salvo) document.documentElement.dataset['tema'] = salvo;
  }

  protected alternarTema(): void {
    const novo: Tema = this.tema() === 'dark' ? 'light' : 'dark';
    this.tema.set(novo);
    document.documentElement.dataset['tema'] = novo;
    localStorage.setItem('tema', novo);
  }
}
