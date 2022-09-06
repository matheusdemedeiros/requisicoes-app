import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequisicoesRoutingModule } from './requisicoes-routing.module';
import { RequisicaoComponent } from './requisicao.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    RequisicaoComponent
  ],
  imports: [
    CommonModule,
    RequisicoesRoutingModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class RequisicoesModule { }
