import type { Evento, Formato } from './tipos';

export type Filtros = {
    busca: string;
    formato: Formato | 'todos';
    cidade: string; 
    soGratuitos: boolean;
};

export function aplicarFiltros(eventos: readonly Evento[], f: Filtros): Evento[] {
  const busca = f.busca.trim().toLowerCase();
  return eventos
    .filter((e) => !f.soGratuitos || e.gratuito)
    .filter((e) => f.formato === 'todos' || e.formato === f.formato)
    .filter((e) => f.cidade === '' || e.cidade === f.cidade)
    .filter(
      (e) =>
        busca === '' ||
        e.titulo.toLowerCase().includes(busca) ||
        e.organizador.toLowerCase().includes(busca),
    )
    .toSorted((a, b) => a.inicioEm.localeCompare(b.inicioEm));
}

export function cidadesDoFormato(eventos: readonly Evento[], formato: Formato | 'todos'): string[] {
  const cidades = eventos
    .filter((e) => formato === 'todos' || e.formato === formato)
    .map((e) => e.cidade)
    .filter((cidade) => cidade !== undefined);
  return [...new Set(cidades)].toSorted((a, b) => a.localeCompare(b, 'pt-BR'));
}