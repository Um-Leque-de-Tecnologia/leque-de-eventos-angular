import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecalho } from './layout/cabecalho/cabecalho';
import { Inicio } from './inicio/inicio';
import { Rodape } from './layout/rodape/rodape';

@Component({
  imports: [RouterOutlet, Cabecalho, Inicio, Rodape],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
