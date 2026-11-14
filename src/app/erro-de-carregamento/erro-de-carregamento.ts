import { Component, DOCUMENT, inject } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-erro-de-carregamento',
  styleUrl: './erro-de-carregamento.css',
  templateUrl: './erro-de-carregamento.html',
})
export class ErroDeCarregamento {
  private readonly documento = inject(DOCUMENT);

  // Recarregar a aplicação inteira é o conserto: o navegador guarda a falha
  // do arquivo da rota, e só esquece dela num recarregamento.
  protected recarregar(): void {
    this.documento.location.reload();
  }
}
