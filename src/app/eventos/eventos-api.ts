import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../api';
import type { Evento, EventoNovo } from './tipos';

// Quem GRAVA. Ler continua com httpResource(), dentro de cada página: ele é um
// signal, e faz sentido para o que a tela mostra. Gravar é uma ação, acontece
// uma vez, na hora do clique — e por isso é uma chamada, não um signal.
@Service()
export class EventosApi {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_URL);

  // firstValueFrom transforma o Observable do HttpClient numa Promise: é com
  // Promise que o envio do formulário trabalha.
  publicar(evento: EventoNovo): Promise<Evento> {
    return firstValueFrom(this.http.post<Evento>(`${this.api}/eventos`, evento));
  }

  editar(slug: string, evento: EventoNovo): Promise<Evento> {
    return firstValueFrom(this.http.put<Evento>(`${this.api}/eventos/${slug}`, evento));
  }

  remover(slug: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.api}/eventos/${slug}`));
  }
}
