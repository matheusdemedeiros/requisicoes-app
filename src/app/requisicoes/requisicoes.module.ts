import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequisicoesRoutingModule } from './requisicoes-routing.module';
import { RequisicaoComponent } from './requisicao.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RequisicaoComponent
  ],
  imports: [
    CommonModule,
    RequisicoesRoutingModule,
    ReactiveFormsModule
  ]
})
export class RequisicoesModule { }
