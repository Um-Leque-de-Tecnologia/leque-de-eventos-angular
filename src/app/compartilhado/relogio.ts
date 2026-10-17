import { Service } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';


@Service()
export class Relogio {
  // interval() é RxJS: um número a cada minuto. toSignal() vira signal.
  readonly agora = toSignal(interval(5_000).pipe(map(() => Date.now())), {
    initialValue: Date.now(),
  });
}