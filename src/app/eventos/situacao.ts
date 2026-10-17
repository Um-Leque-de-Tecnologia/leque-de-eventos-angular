import type { Evento } from './tipos';

export type Situacao = 'futuro' | 'hoje' | 'acontecendo' | 'encerrado';

// Função pura: o mesmo evento e a mesma hora dão sempre a mesma resposta.
// `agora` em milissegundos, como Date.now() devolve.
export function situacaoDoEvento(evento: Evento, agora: number): Situacao {
  const inicio = new Date(evento.inicioEm).getTime();
  const fim = inicio + evento.duracaoMin * 60_000;

  if (agora >= fim) return 'encerrado';
  if (agora >= inicio) return 'acontecendo';
  if (new Date(inicio).toDateString() === new Date(agora).toDateString()) return 'hoje';
  return 'futuro';
}