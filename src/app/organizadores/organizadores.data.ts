import type { Organizador } from './organizador';

// PROVISÓRIO, como o eventos.data.ts: na aula 07 vem por HTTP.
// Um organizador para cada organizadorSlug que aparece no eventos.data.ts — o
// organizadores.data.spec.ts confere.
export const ORGANIZADORES: readonly Organizador[] = [
  {
    slug: 'react-recife',
    nome: 'React Recife',
    sobre: 'Comunidade de quem escreve front-end com React em Recife. Um meetup por mês, sempre com espaço para quem está começando.',
    site: 'https://example.org/react-recife',
  },
  {
    slug: 'angular-recife',
    nome: 'Angular Recife',
    sobre: 'Encontros sobre Angular em Recife: signals, rotas, formulários e o que muda a cada versão do framework.',
    site: 'https://example.org/angular-recife',
  },
  {
    slug: 'python-nordeste',
    nome: 'Python Nordeste',
    sobre: 'A comunidade Python dos nove estados do Nordeste, com workshops de dados e a conferência regional todo ano.',
    site: 'https://example.org/python-nordeste',
  },
  {
    slug: 'devops-brasil',
    nome: 'DevOps Brasil',
    sobre: 'Lives e encontros sobre infraestrutura, Kubernetes, observabilidade e a rotina de quem opera sistemas em produção.',
    site: 'https://example.org/devops-brasil',
  },
  {
    slug: 'mulheres-em-tech',
    nome: 'Mulheres em Tech',
    sobre: 'Rede de mulheres na tecnologia, com rodas de conversa sobre carreira, mentoria e o primeiro emprego na área.',
    site: 'https://example.org/mulheres-em-tech',
  },
  {
    slug: 'node-pe',
    nome: 'Node PE',
    sobre: 'Comunidade de Node.js de Pernambuco: back-end, APIs e segurança, com sessões práticas e mão na massa.',
    site: 'https://example.org/node-pe',
  },
  {
    slug: 'ux-nordeste',
    nome: 'UX Nordeste',
    sobre: 'Pessoas de design, pesquisa e desenvolvimento que querem produtos que todo mundo consiga usar.',
    site: 'https://example.org/ux-nordeste',
  },
  {
    slug: 'flutter-joao-pessoa',
    nome: 'Flutter João Pessoa',
    sobre: 'Grupo de desenvolvimento mobile com Flutter em João Pessoa, que organiza hackathons e encontros de estudo.',
    site: 'https://example.org/flutter-joao-pessoa',
  },
];
