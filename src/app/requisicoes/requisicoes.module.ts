import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequisicoesRoutingModule } from './requisicoes-routing.module';
import { RequisicaoComponent } from './requisicao.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ResuisicoesFuncionarioComponent } from './requisicoes-funcionario/requisicoes-funcionario.component';
import { RequisicoesDepartamentoComponent } from './requisicoes-departamento/requisicoes-departamento.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { RequisicaoDetalhesComponent } from './detalhes/requisicao-detalhes/requisicao-detalhes.component';


@NgModule({
  declarations: [
    RequisicaoComponent,
    ResuisicoesFuncionarioComponent,
    RequisicoesDepartamentoComponent,
    DetalhesComponent,
    RequisicaoDetalhesComponent
  ],
  imports: [
    CommonModule,
    RequisicoesRoutingModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class RequisicoesModule { }
