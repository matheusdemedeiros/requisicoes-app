import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { FuncionarioService } from '../funcionarios/services/funcionario.service';
import { Notificador } from '../shared/notificador.service';
import { Requisicao } from './models/requisicao.model';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html',
  styleUrls: ['./requisicao.component.css']
})
export class RequisicaoComponent implements OnInit {
  public requisicoes$:Observable<Requisicao[]>;

  constructor(private fb: FormBuilder,
    private notificador: Notificador,
    private funcionarioService: FuncionarioService,
    private departamentoService: DepartamentoService,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
  }

}
