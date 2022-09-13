import { Component, Input, OnInit } from '@angular/core';
import { Requisicao } from '../../models/requisicao.model';

@Component({
  selector: 'app-requisicao-detalhes',
  templateUrl: './requisicao-detalhes.component.html',
  styleUrls: ['./requisicao-detalhes.component.css'],
})
export class RequisicaoDetalhesComponent {
  @Input() requisicao: Requisicao;
}
