import { DatePipe } from '@angular/common';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { API_URL } from '../../api';
import { Aviso } from '../../compartilhado/aviso/aviso';
import { NaoEncontrada } from '../../nao-encontrada/nao-encontrada';
import { RelacionadosEvento } from '../relacionados-evento/relacionados-evento';
import type { Evento } from '../tipos';

@Component({
  imports: [DatePipe, RouterLink, RelacionadosEvento, Aviso, NaoEncontrada],
  selector: 'app-detalhe-evento',
  styleUrl: './detalhe-evento.css',
  templateUrl: './detalhe-evento.html',
})
export class DetalheEvento {
  private readonly api = inject(API_URL);

  // O :slug do endereço chega aqui como input. Quem liga os dois, pelo nome,
  // é o withComponentInputBinding() do app.config.ts.
  readonly slug = input.required<string>();

  // O computed() da aula 06 virou httpResource(), e lê o MESMO slug(): de um
  // evento para outro, a URL muda — e ele busca de novo, sozinho.
  protected readonly evento = httpResource<Evento>(() => `${this.api}/eventos/${this.slug()}`);

  // O evento, quando ele já chegou. Em estado de erro, value() lança; hasValue()
  // pergunta antes.
  protected readonly atual = computed(() => (this.evento.hasValue() ? this.evento.value() : undefined));

  // 404 é "não existe", e tem página própria. Qualquer outro erro é "não
  // chegou", e tem um "Tentar de novo".
  protected readonly naoExiste = computed(() => {
    const erro = this.evento.error();
    return erro instanceof HttpErrorResponse && erro.status === 404;
  });

  // 150 → "2h30" · 480 → "8h" · 45 → "45 min"
  protected readonly duracao = computed(() => {
    const total = this.atual()?.duracaoMin ?? 0;
    const horas = Math.floor(total / 60);
    const minutos = total % 60;
    if (horas === 0) return `${minutos} min`;
    return minutos === 0 ? `${horas}h` : `${horas}h${String(minutos).padStart(2, '0')}`;
  });
}
