import { Service } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';

// A hora de "agora", uma só para a aplicação inteira: todo card, a home e o
// catálogo concordam sobre ela.
@Service()
export class Relogio {
  // interval() é RxJS: um número a cada minuto. toSignal() vira signal.
  readonly agora = toSignal(interval(60_000).pipe(map(() => Date.now())), {
    initialValue: Date.now(),
  });
}
