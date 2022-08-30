import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable(
  {providedIn:"root"}
)
export class Notificador {
  constructor(private toastr: ToastrService) {}

  notificacaoSucesso(titulo: string, mensagem: string) {
    this.toastr.success(mensagem, titulo);
  }

  notificacaoErro(titulo: string, mensagem: string) {
    this.toastr.error(mensagem, titulo);
  }
}
