import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EVENTOS } from '../eventos.data';
import { ListaEventos } from '../lista-eventos/lista-eventos';

@Component({
  imports: [DatePipe, RouterLink, ListaEventos],
  selector: 'app-detalhe-evento',
  styleUrl: './detalhe-evento.css',
  templateUrl: './detalhe-evento.html',
})
export class DetalheEvento {
  // O :slug do endereço chega aqui como input. Quem liga os dois, pelo nome,
  // é o withComponentInputBinding() do app.config.ts.
  readonly slug = input.required<string>();

  // undefined quando nenhum evento tem esse slug: aí o @if do template não desenha nada.
  protected readonly evento = computed(() => EVENTOS.find((e) => e.slug === this.slug()));

  // 150 → "2h30" · 480 → "8h" · 45 → "45 min"
  protected readonly duracao = computed(() => {
    const total = this.evento()?.duracaoMin ?? 0;
    const horas = Math.floor(total / 60);
    const minutos = total % 60;
    if (horas === 0) return `${minutos} min`;
    return minutos === 0 ? `${horas}h` : `${horas}h${String(minutos).padStart(2, '0')}`;
  });

   protected readonly relacionados = computed(() => {
    const atual = this.evento();
    if (!atual) return [];
    return EVENTOS.filter((e) => e.categoria === atual.categoria && e.slug !== atual.slug).slice(0, 3);
  });
}