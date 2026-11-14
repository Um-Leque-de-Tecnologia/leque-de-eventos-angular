export type Formato = 'Presencial' | 'Online' | 'Híbrido';
export type Nivel = 'Iniciante' | 'Intermediário' | 'Avançado';

export type Evento = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  descricao: string;
  organizador: string;
  organizadorSlug: string;
  categoria: string;
  formato: Formato;
  cidade?: string; // "?": pode não vir — evento online não tem cidade
  inicioEm: string; // ISO: "2026-10-08T19:00"
  duracaoMin: number;
  gratuito: boolean;
  vagas: number | null; // "| null": vem sempre, e null quer dizer ilimitado
  nivel: Nivel;
  programacao?: ItemDaProgramacao[]; // aula 08: os blocos do dia, opcional
};

export type ItemDaProgramacao = { horario: string; atividade: string };

// O que o app MANDA para a API. O id e o nome do organizador quem põe é ela.
export type EventoNovo = Omit<Evento, 'id' | 'organizador'>;
