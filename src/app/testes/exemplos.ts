import type { Evento } from '../eventos/tipos';
import type { Organizador } from '../organizadores/organizador';

// Os dados dos testes. Os da aplicação agora estão na API; os testes não
// dependem dela, nem dos eventos de ninguém.
export const EVENTO_DE_TESTE: Evento = {
  id: 't1',
  slug: 'evento-de-teste',
  titulo: 'Evento de teste',
  resumo: 'Um resumo.',
  descricao: 'Uma descrição que passa na regra do formulário.',
  organizador: 'Organização de teste',
  organizadorSlug: 'organizacao-de-teste',
  categoria: 'Front-end',
  formato: 'Online',
  inicioEm: '2026-11-14T10:00',
  duracaoMin: 90,
  gratuito: true,
  vagas: null,
  nivel: 'Iniciante',
};

export const ORGANIZADOR_DE_TESTE: Organizador = {
  slug: 'organizacao-de-teste',
  nome: 'Organização de teste',
  sobre: 'Quem organiza os eventos dos testes.',
  site: 'https://example.org',
};
