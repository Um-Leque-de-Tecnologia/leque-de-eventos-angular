import type { Evento, EventoNovo, Formato, ItemDaProgramacao, Nivel } from './tipos';

// O evento enquanto alguém escreve: tudo o que o formulário preenche, e nada do
// que a API inventa. Campo de texto vazio é '', e não undefined: é um valor que
// o <input> sabe mostrar.
export type Rascunho = {
  titulo: string;
  slug: string;
  resumo: string;
  descricao: string;
  organizadorSlug: string;
  categoria: string;
  formato: Formato;
  cidade: string;
  inicioEm: string;
  duracaoMin: number;
  gratuito: boolean;
  vagas: number | null;
  nivel: Nivel;
  programacao: ItemDaProgramacao[]; // uma lista: cresce e encolhe na tela
};

export const RASCUNHO_VAZIO: Rascunho = {
  titulo: '',
  slug: '',
  resumo: '',
  descricao: '',
  organizadorSlug: '',
  categoria: '',
  formato: 'Presencial',
  cidade: '',
  inicioEm: '',
  duracaoMin: 60,
  gratuito: true,
  vagas: null,
  nivel: 'Iniciante',
  programacao: [],
};

// As opções dos <select>. As do briefing, nos mesmos nomes.
export const CATEGORIAS = ['Front-end', 'Back-end', 'Dados', 'Design', 'Carreira'];
export const FORMATOS: Formato[] = ['Presencial', 'Online', 'Híbrido'];
export const NIVEIS: Nivel[] = ['Iniciante', 'Intermediário', 'Avançado'];

// "React Recife · Meetup #42" → "react-recife-meetup-42"
export function paraSlug(titulo: string): string {
  return titulo
    .normalize('NFD') // separa a letra do acento...
    .replace(/[̀-ͯ]/g, '') // ...e joga o acento fora
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// O que vai para a API. Evento online não tem cidade: se a pessoa escreveu uma e
// depois trocou o formato, ela fica no rascunho, mas não vai.
export function paraEnvio(rascunho: Rascunho): EventoNovo {
  const { cidade, ...resto } = rascunho;
  return rascunho.formato === 'Online' ? resto : { ...resto, cidade };
}

// O caminho de volta: o evento que chegou da API vira o que o formulário edita.
export function paraRascunho(evento: Evento): Rascunho {
  const { id: _id, organizador: _organizador, ...resto } = evento;
  return { ...resto, cidade: evento.cidade ?? '', programacao: evento.programacao ?? [] };
}
