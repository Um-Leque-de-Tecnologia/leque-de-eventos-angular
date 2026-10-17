import type { Evento } from './tipos';
import { EVENTOS } from './eventos.data';
import { situacaoDoEvento } from './situacao';

// Data e duração fixas: o teste não pode depender do dia em que roda.
const evento: Evento = { ...EVENTOS[0], inicioEm: '2026-11-14T10:00', duracaoMin: 240 };
const hora = (iso: string) => new Date(iso).getTime();

describe('situacaoDoEvento', () => {
  it('antes do dia do evento: futuro', () => {
    expect(situacaoDoEvento(evento, hora('2026-11-13T23:59'))).toBe('futuro');
  });

  it('no dia, antes de começar: hoje', () => {
    expect(situacaoDoEvento(evento, hora('2026-11-14T08:00'))).toBe('hoje');
  });

  it('entre o início e o fim: acontecendo', () => {
    expect(situacaoDoEvento(evento, hora('2026-11-14T12:00'))).toBe('acontecendo');
  });

  it('a partir do fim: encerrado', () => {
    expect(situacaoDoEvento(evento, hora('2026-11-14T14:00'))).toBe('encerrado');
  });
});