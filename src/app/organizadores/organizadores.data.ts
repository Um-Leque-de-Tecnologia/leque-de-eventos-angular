import type { Organizador } from './organizador';

// PROVISÓRIO, como o eventos.data.ts: na aula 07 vem por HTTP.
// Um organizador para cada organizadorSlug que aparece nos eventos.
export const ORGANIZADORES: readonly Organizador[] = [
  {
    slug: 'react-recife',
    nome: 'React Recife',
    sobre: 'Comunidade de quem escreve front-end em Recife. Um meetup por mês, sempre com uma palestra de quem está começando.',
    site: 'https://example.org/react-recife',
  },
  {
    slug: 'a11y-brasil',
    nome: 'A11y Brasil',
    sobre: 'Pessoas de design, desenvolvimento e conteúdo que querem uma web que todo mundo consiga usar.',
    site: 'https://example.org/a11y-brasil',
  },
  {
    slug: 'mulheres-em-dados',
    nome: 'Mulheres em Dados',
    sobre: 'Encontros online para mulheres que estão entrando na área de dados, do primeiro SELECT ao primeiro dashboard.',
    site: 'https://example.org/mulheres-em-dados',
  },
  {
    slug: 'python-nordeste',
    nome: 'Python Nordeste',
    sobre: 'A comunidade Python dos nove estados do Nordeste, que organiza a conferência regional todo ano.',
    site: 'https://example.org/python-nordeste',
  },
  {
    slug: 'gdg-recife',
    nome: 'GDG Recife',
    sobre: 'Grupo de desenvolvedores que estuda e ensina as tecnologias do Google: Angular, Android, Firebase e nuvem.',
    site: 'https://example.org/gdg-recife',
  },
  {
    slug: 'porto-digital',
    nome: 'Porto Digital',
    sobre: 'Parque tecnológico no centro do Recife, que abre o espaço para hackathons e eventos da comunidade.',
    site: 'https://example.org/porto-digital',
  },
  {
    slug: 'comunidade-tech-pe',
    nome: 'Comunidade Tech PE',
    sobre: 'Rede de profissionais de tecnologia de Pernambuco, com conversas sobre carreira, mentoria e vagas.',
    site: 'https://example.org/comunidade-tech-pe',
  },
  {
    slug: 'devops-sp',
    nome: 'DevOps SP',
    sobre: 'Quem opera sistemas em produção em São Paulo: plataformas, observabilidade e a conta da nuvem.',
    site: 'https://example.org/devops-sp',
  },
];