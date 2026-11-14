import { HttpContext, HttpErrorResponse, httpResource } from '@angular/common/http';
import { afterNextRender, Component, computed, effect, inject, Injector, input, linkedSignal, signal } from '@angular/core';
import {
  applyEach,
  type FieldTree,
  form,
  FormField,
  FormRoot,
  hidden,
  max,
  maxLength,
  min,
  minLength,
  pattern,
  readonly,
  required,
  type TreeValidationResult,
  validate,
  validateHttp,
} from '@angular/forms/signals';
import { Router } from '@angular/router';
import { API_URL } from '../../api';
import { Aviso } from '../../compartilhado/aviso/aviso';
import { AriaDoCampo } from '../../compartilhado/campo/aria-do-campo';
import { ErrosDoCampo } from '../../compartilhado/campo/erros-do-campo';
import { SEM_FAIXA } from '../../compartilhado/carregando.interceptor';
import { NaoEncontrada } from '../../nao-encontrada/nao-encontrada';
import type { Organizador } from '../../organizadores/organizador';
import { EventosApi } from '../eventos-api';
import { CATEGORIAS, FORMATOS, NIVEIS, paraEnvio, paraRascunho, paraSlug, RASCUNHO_VAZIO, type Rascunho } from '../rascunho';
import type { Evento } from '../tipos';

@Component({
  imports: [FormField, FormRoot, AriaDoCampo, ErrosDoCampo, Aviso, NaoEncontrada],
  selector: 'app-formulario-evento',
  styleUrl: './formulario-evento.css',
  templateUrl: './formulario-evento.html',
})
export class FormularioEvento {
  private readonly api = inject(API_URL);
  private readonly eventos = inject(EventosApi);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);

  protected readonly categorias = CATEGORIAS;
  protected readonly formatos = FORMATOS;
  protected readonly niveis = NIVEIS;

  // A lista do <select> de organizador vem da API, como tudo o mais.
  protected readonly organizadores = httpResource<Organizador[]>(() => `${this.api}/organizadores`, {
    defaultValue: [],
  });

  protected readonly erroAoSalvar = signal(false);

  // O mesmo componente nas duas rotas: /eventos/:slug/editar traz o slug, e
  // /eventos/novo não traz. Sem slug, a URL é undefined, e o recurso fica parado.
  readonly slug = input<string>();
  protected readonly editando = computed(() => this.slug() !== undefined);

  protected readonly existente = httpResource<Evento>(() => {
    const slug = this.slug();
    return slug ? `${this.api}/eventos/${slug}` : undefined;
  });

  private readonly atual = computed(() => (this.existente.hasValue() ? this.existente.value() : undefined));

  protected readonly naoExiste = computed(() => {
    const erro = this.existente.error();
    return erro instanceof HttpErrorResponse && erro.status === 404;
  });

  // O formulário só entra em cena com tudo na mão. O <select> de organizador,
  // desenhado sem as opções, perderia o valor do evento que está sendo editado.
  protected readonly carregando = computed(() => this.existente.isLoading() || this.organizadores.isLoading());
  protected readonly falhou = computed(() => Boolean(this.existente.error() || this.organizadores.error()));

  // O modelo. linkedSignal, e não signal: é um signal que você escreve, e que
  // recomeça do valor abaixo quando o evento chega da API.
  protected readonly rascunho = linkedSignal<Rascunho>(() => {
    const atual = this.atual();
    return atual ? paraRascunho(atual) : RASCUNHO_VAZIO;
  });

  protected readonly erroAoRemover = signal(false);
  protected readonly removendo = signal(false);

  // form() olha para o signal e devolve uma árvore com a mesma forma: f.titulo,
  // f.formato... Cada ponta sabe o valor, se foi tocada, se está válida.
  // O segundo argumento é o schema: as regras, num lugar só, longe do HTML. O
  // terceiro são as opções: o que fazer quando alguém envia.
  protected readonly f = form(
    this.rascunho,
    (c) => {
      required(c.titulo, { message: 'Dê um título ao evento.' });
      minLength(c.titulo, 5, { message: 'O título precisa de pelo menos 5 caracteres.' });
      maxLength(c.titulo, 100, { message: 'O título pode ter até 100 caracteres.' });

      required(c.slug, { message: 'Diga o endereço do evento.' });
      pattern(c.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, { message: 'Use só letras minúsculas, números e hífens.' });
      // Na edição, o endereço não muda: ele é a identidade do evento, e pode já
      // estar no grupo da turma. Sem isso, também, o evento acharia a si mesmo.
      readonly(c.slug, () => this.editando());
      // A regra que só a API sabe responder: esse endereço está livre? O próprio
      // validador faz o pedido, e cancela o anterior se a pessoa continuar digitando.
      // O 200 é a má notícia (já existe); o 404 é a boa (está livre).
      validateHttp(c.slug, {
        when: () => !this.editando(),
        request: ({ value }) => ({
          url: `${this.api}/eventos/${value()}`,
          context: new HttpContext().set(SEM_FAIXA, true),
        }),
        debounce: 400,
        onSuccess: () => ({ kind: 'slugEmUso', message: 'Já existe um evento com este endereço.' }),
        onError: (erro) =>
          erro instanceof HttpErrorResponse && erro.status === 404
            ? undefined
            : { kind: 'slugNaoConferido', message: 'Não deu para conferir este endereço agora.' },
      });

      required(c.resumo, { message: 'Escreva um resumo: é o que aparece no card.' });
      minLength(c.resumo, 10, { message: 'O resumo precisa de pelo menos 10 caracteres.' });
      maxLength(c.resumo, 160, { message: 'O resumo pode ter até 160 caracteres.' });

      required(c.descricao, { message: 'Conte como é o evento.' });
      minLength(c.descricao, 20, { message: 'A descrição precisa de pelo menos 20 caracteres.' });
      maxLength(c.descricao, 2000, { message: 'A descrição pode ter até 2000 caracteres.' });

      required(c.organizadorSlug, { message: 'Escolha quem organiza.' });
      required(c.categoria, { message: 'Escolha a área.' });
      required(c.inicioEm, { message: 'Diga quando começa.' });
      // Uma regra que o Angular não traz pronta: quem diz o que é errado é você.
      // Um evento que já passou continua editável: só cobra de quem mudou a data.
      validate(c.inicioEm, ({ value }) =>
        value() && value() !== this.atual()?.inicioEm && new Date(value()) <= new Date()
          ? { kind: 'noPassado', message: 'A data precisa ser no futuro.' }
          : undefined,
      );

      required(c.duracaoMin, { message: 'Diga quanto tempo dura.' });
      min(c.duracaoMin, 15, { message: 'A duração mínima é de 15 minutos.' });
      max(c.duracaoMin, 20160, { message: 'A duração máxima é de 14 dias.' });

      // Vazio é válido: quer dizer sem limite. min() só olha quando tem número.
      min(c.vagas, 1, { message: 'Deixe vazio, ou diga pelo menos 1 vaga.' });

      // Uma regra que depende de OUTRO campo: valueOf lê o formato e, como é um
      // signal por baixo, ela roda de novo quando ele muda. Campo escondido não
      // conta para a validação: o required abaixo só cobra quando a cidade aparece.
      hidden(c.cidade, ({ valueOf }) => valueOf(c.formato) === 'Online');
      required(c.cidade, { message: 'Diga em que cidade vai ser.' });

      // As regras de UM item, e o Angular aplica a cada item da lista, por mais
      // que ela cresça. A árvore acompanha o tamanho do array do signal.
      applyEach(c.programacao, (item) => {
        required(item.horario, { message: 'Diga o horário.' });
        required(item.atividade, { message: 'Diga o que acontece nesse horário.' });
        minLength(item.atividade, 3, { message: 'Use pelo menos 3 caracteres.' });
        maxLength(item.atividade, 120, { message: 'Use até 120 caracteres.' });
      });
    },
    {
      submission: {
        // Só roda com o formulário válido. Antes dele, o Angular marca todos os
        // campos como tocados: as mensagens aparecem de uma vez.
        action: () => this.enviar(),
        onInvalid: () => this.focarPrimeiroErro(),
      },
    },
  );

  constructor() {
    // O endereço nasce do título, até a pessoa mexer nele: depois disso, ele é
    // dela. dirty() só fica verdadeiro quando quem mudou foi alguém digitando.
    effect(() => {
      const titulo = this.f.titulo().value();
      if (!this.editando() && !this.f.slug().dirty()) this.f.slug().value.set(paraSlug(titulo));
    });
  }

  protected tentarDeNovo(): void {
    this.existente.reload();
    this.organizadores.reload();
  }

  protected async remover(): Promise<void> {
    const slug = this.slug();
    if (!slug || !confirm(`Remover "${this.rascunho().titulo}"? Isso não tem volta.`)) return;
    this.removendo.set(true);
    this.erroAoRemover.set(false);
    try {
      await this.eventos.remover(slug);
      await this.router.navigateByUrl('/eventos');
    } catch {
      this.erroAoRemover.set(true);
    } finally {
      this.removendo.set(false);
    }
  }

  // Mudar a lista é mudar o signal: um array NOVO, nunca um push().
  protected adicionarItem(): void {
    this.f.programacao().value.update((itens) => [...itens, { horario: '', atividade: '' }]);
    // O input novo só existe depois de desenhar. Quem adicionou continua digitando
    // dali, em vez de ter que caçar o campo com o Tab.
    const novo = this.f.programacao().value().length - 1;
    afterNextRender(() => this.f.programacao[novo].horario().focusBoundControl(), {
      injector: this.injector,
    });
  }

  protected removerItem(posicao: number): void {
    this.f.programacao().value.update((itens) => itens.filter((_, i) => i !== posicao));
  }

  // A pessoa clicou em "Publicar", e a mensagem está lá em cima: leve o foco até lá.
  private focarPrimeiroErro(): void {
    this.f().errorSummary()[0]?.fieldTree().focusBoundControl();
  }

  // O que devolve vira erro no formulário. Sem erro, devolve undefined.
  private async enviar(): Promise<TreeValidationResult> {
    this.erroAoSalvar.set(false);
    try {
      const slug = this.slug();
      const evento = paraEnvio(this.rascunho());
      const salvo = slug ? await this.eventos.editar(slug, evento) : await this.eventos.publicar(evento);
      await this.router.navigate(['/eventos', salvo.slug]);
      return undefined;
    } catch (erro) {
      return this.errosDoServidor(erro);
    }
  }

  // A API também valida, e diz o campo: { campos: { titulo: "Escreva…" } }. Cada
  // um volta para a sua ponta da árvore, e aparece embaixo do input, como
  // qualquer outro erro. Qualquer outra falha é do formulário inteiro.
  private errosDoServidor(erro: unknown): TreeValidationResult {
    const campos: Record<string, string> =
      erro instanceof HttpErrorResponse ? (erro.error?.campos ?? {}) : {};
    const erros = Object.entries(campos).map(([nome, message]) => ({
      kind: 'servidor',
      message,
      fieldTree: this.campoPeloNome(nome),
    }));
    if (erros.length === 0) {
      // Um signal, e não um erro devolvido: erro devolvido só sai quando o valor
      // muda, e o "Publicar" não tentaria de novo depois de a rede voltar.
      this.erroAoSalvar.set(true);
      return undefined;
    }
    erros[0].fieldTree().focusBoundControl();
    return erros;
  }

  // "titulo" → f.titulo · "programacao.0.horario" → f.programacao[0].horario
  private campoPeloNome(nome: string): FieldTree<unknown> {
    return nome
      .split('.')
      .reduce(
        (campo, parte) => (campo as unknown as Record<string, FieldTree<unknown>>)[parte],
        this.f as unknown as FieldTree<unknown>,
      );
  }
}
