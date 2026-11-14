# Leque de Eventos · Angular

Catálogo de eventos de tecnologia, feito no curso de Frontend Avançado (aulas 03 a 09).

**No ar:** _(cole aqui o link da Vercel depois do primeiro deploy)_

Angular 22.2, standalone e zoneless, com signals, rotas lazy, `httpResource()` e Signal Forms. Os dados vêm da
[API do curso](https://aulas.umlequedetecnologia.com.br/api/leque-de-eventos/docs), na sala
`/sala/nicoly-almeida` (ela aceita gravar, ao contrário do `/exemplo`).

```bash
npm ci
npx ng serve              # http://localhost:4200
npx ng test --watch=false # 18 arquivos, 34 testes
npx ng build              # dist/leque-de-eventos-angular/browser
```

## Os signals do projeto

| Onde | Signal | Tipo | Por quê |
| --- | --- | --- | --- |
| `Catalogo` | `busca`, `formato`, `soGratuitos` | `signal` | estado que a pessoa escreve pelos filtros |
| `Catalogo` | `buscaAdiada` | `toSignal(toObservable(...))` | a busca espera 300 ms sem digitação (o `debounceTime` é do RxJS) |
| `Catalogo` | `cidades`, `visiveis`, `resumo` | `computed` | derivados: só se recalculam quando o que eles leem muda |
| `Catalogo` | `cidade` | `linkedSignal` | a pessoa escolhe (`set`), mas ela volta para "todas" quando some das opções do formato |
| `Catalogo`, `Inicio`, `DetalheEvento`… | `eventos`, `evento`… | `httpResource` | um signal que busca na API e sabe se está carregando, se chegou ou se deu erro |
| `Cabecalho` | `tema` | `signal` + `effect` | o `effect` é o único lugar que escreve no `document` e no `localStorage` |
| `Relogio` | `agora` | `toSignal(interval(60_000))` | um `@Service()` com a hora, que todos os cards e a home compartilham |
| `Carregando` | `algum` | `computed` | o interceptor conta os pedidos em andamento, e a faixa do `App` lê |
| `FormularioEvento` | `rascunho` | `linkedSignal` | a pessoa escreve nele, e ele recomeça do evento que chega da API na edição |

Nenhum `BehaviorSubject`. O único `effect` que escreve em signal é o do formulário: ele copia o título para o
endereço (slug) até a pessoa mexer no endereço, e depois para.

## As rotas do projeto

| Endereço | Componente | Lazy | Guard | Título da aba |
| --- | --- | --- | --- | --- |
| `/` | `Inicio` | não | — | Leque de Eventos |
| `/eventos` | `Catalogo` | sim (`eventos-routes`) | — | Eventos · Leque de Eventos |
| `/eventos/novo` | `FormularioEvento` | sim (`loadComponent`, arquivo próprio) | — | Publicar evento |
| `/eventos/:slug/editar` | `FormularioEvento` | sim (o mesmo arquivo) | — | Editar evento |
| `/eventos/:slug` | `DetalheEvento` | sim (`eventos-routes`) | — | resolver: o título do evento, vindo da API |
| `/organizadores` | — | sim | — | `redirectTo: '/eventos'` (não existe lista de organizadores) |
| `/organizadores/:slug` | `PerfilOrganizador` | sim (`organizadores-routes`) | — | resolver: o nome do organizador |
| `/erro` | `ErroDeCarregamento` | não | — | Não foi possível abrir a página |
| `**` | `NaoEncontrada` | não | — | Página não encontrada |

- **O slug chega como `input()`, não pelo `snapshot`.** O `withComponentInputBinding()` liga o `:slug` ao input de
  mesmo nome. Como é um signal, ir de um evento para outro pelo "Mais eventos de…" reaproveita o componente e tudo
  que depende do slug se refaz; com o `snapshot`, o endereço mudava e o título não.
- **Os guards `canMatch` saíram na aula 07.** Na aula 06, `eventoExiste` e `organizadorExiste` recusavam um slug que
  não estava na lista da memória, e o router seguia até o `**`. Com os dados na API, o guard teria que esperar a rede
  (um terceiro pedido do mesmo evento). Agora quem diz "não existe" é a API, com 404, e a página mostra a
  `<app-nao-encontrada />`.
- **A 404 e a página de erro não são lazy:** precisam aparecer justamente quando um arquivo não chega.
- **O "Recarregar" da página de erro não é um `routerLink`:** o navegador guarda a falha do arquivo da rota, e só um
  recarregamento faz ele esquecer.

## Os formulários do projeto

O `FormularioEvento` usa Signal Forms (`@angular/forms/signals`) e serve a duas rotas: sem slug, publica; com slug,
abre preenchido e edita.

- **Onde cada regra mora:** todas no schema do `form()`, em `formulario-evento.ts`, cada uma com a sua mensagem.
  `required`, `minLength`, `maxLength`, `min`, `max` e `pattern` nos campos; `validate()` para "a data precisa ser no
  futuro" (só cobra se a data mudou, para um evento antigo continuar editável); `hidden()` na cidade quando o formato
  é Online (campo escondido não conta na validação); `applyEach()` para as regras de cada item da programação;
  `readonly()` no endereço durante a edição.
- **O que a tela confere na rede:** `validateHttp()` pergunta à API se o endereço está livre, 400 ms depois de a
  pessoa parar de digitar (o 404 é a boa notícia). Esse pedido leva o `SEM_FAIXA`, para a faixa "Carregando" não
  piscar a cada pausa.
- **O que só a API confere:** ela valida tudo de novo no envio e devolve 422 com `campos`; cada mensagem volta para o
  campo dela (`errosDoServidor`). O 409 de endereço repetido também. Falha de rede vira o signal `erroAoSalvar`, e
  não um erro do formulário, para o "Publicar" funcionar de novo quando a rede voltar.
- **Por que `linkedSignal` no modelo:** ele precisa ser as duas coisas: o valor que a pessoa escreve e o valor que
  recomeça quando o evento chega da API. Com um `signal` comum, seria preciso um `effect()` copiando um no outro.
- **Acessibilidade:** a diretiva `AriaDoCampo` (seletor `[formField]`) põe `aria-invalid` e `aria-describedby` em
  todo campo com erro; o envio inválido leva o foco ao primeiro erro; adicionar um item da programação foca o
  horário novo, e remover devolve o foco ao "Adicionar".

## O que eu medi

`ng build`, tamanho transferido (comprimido):

| Depois de | `main` | `eventos-routes` | Outros |
| --- | --- | --- | --- |
| Aula 07 (dados por HTTP) | 81.36 kB | 3.66 kB | `organizadores-routes` 1.35 kB |
| Aula 08 (formulário no `eventos-routes`) | 85.54 kB | 23.00 kB | |
| Aula 09 · formulário com `loadComponent` | 85.61 kB | 3.86 kB | `formulario-evento` 20.18 kB |
| Aula 09 · `@defer` nos relacionados | 89.10 kB | 3.93 kB | `relacionados-evento` 592 bytes |
| Aula 09 · capa com `NgOptimizedImage` | 92.01 kB | 3.92 kB | |

- **O formulário lazy se pagou:** quem só procura evento deixou de baixar ~19 kB da biblioteca de formulários.
- **O `@defer` não se pagou em bytes:** para adiar 592 bytes, o `main` cresceu 3,5 kB de código de `@defer`. O que
  ele economiza é o pedido `?categoria=` à API em cada detalhe aberto por quem não rola até o fim. Mantive pelo
  pedido a menos, mas num componente leve assim ele é discutível; ele faria mais sentido num componente pesado.
- **A imagem** custou ~2,9 kB de diretiva no `main`. O ganho não aparece na tabela: o `priority` faz a capa (o LCP da
  home) chegar primeiro, e o `width`/`height` reservam o espaço para a página não pular.

## O que ficou de fora

- O resolver do título e o componente ainda pedem o mesmo evento duas vezes.
- Os filtros não vão para o endereço (`/eventos?formato=Online&gratuitos=1`).
- Não há aviso de "sair sem salvar" (`canDeactivate`) no formulário.
- Os organizadores de `organizadores.data.ts` (usados só nos testes) têm sites de exemplo (`example.org`).
