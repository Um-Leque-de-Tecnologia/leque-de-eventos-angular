import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { Carregando } from './carregando';

// Interceptor: uma função no meio do caminho de TODO pedido do HttpClient —
// e do httpResource, que usa o HttpClient por baixo. Recebe o pedido, passa
// adiante com next(), e pode olhar a resposta voltando.
export const carregandoInterceptor: HttpInterceptorFn = (pedido, next) => {
  const carregando = inject(Carregando);
  carregando.comecou();
  // finalize roda quando o pedido acaba: deu certo, deu erro ou foi cancelado.
  return next(pedido).pipe(finalize(() => carregando.terminou()));
};
