import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Equipamento } from '../equipamentos/models/equipamento.model';
import { EquipamentoService } from '../equipamentos/services/equipamento.service';
import { Funcionario } from '../funcionarios/models/funcionario.model';
import { FuncionarioService } from '../funcionarios/services/funcionario.service';
import { Notificador } from '../shared/notificador.service';
import { Requisicao } from './models/requisicao.model';
import { RequisicaoService } from './services/requisicao.service';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html',
  styleUrls: ['./requisicao.component.css'],
})
export class RequisicaoComponent implements OnInit {
  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public funcionarios$: Observable<Funcionario[]>;
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notificador: Notificador,
    private requisicaoService: RequisicaoService,
    private departamentoService: DepartamentoService,
    private equipamentoService: EquipamentoService,
    private funcionarioService: FuncionarioService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
    this.form = this.fb.group({
      id: new FormControl(''),
      departamentoId: new FormControl('', Validators.required),
      departamento: new FormControl(''),
      descricao: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      equipamentoId: new FormControl(''),
      equipamento: new FormControl(''),
    });
  }

  get departamentoId(): AbstractControl | null {
    return this.form.get('departamentoId');
  }

  get departamento(): AbstractControl | null {
    return this.form.get('departamento');
  }
  get descricao(): AbstractControl | null {
    return this.form.get('descricao');
  }

  get id(): AbstractControl | null {
    return this.form.get('id');
  }

  get tituloModal(): string {
    return this.id?.value ? 'Atualização' : 'Cadastro';
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset();
    if (requisicao) {
      const departamento = requisicao.departamentoDestino
        ? requisicao.departamentoDestino
        : null;
      const equipamento = requisicao.equipamento
        ? requisicao.equipamento
        : null;

      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        equipamento,
      };

      this.form.get('requisicao')?.setValue(requisicaoCompleta);
    }

    try {
      await this.modalService.open(modal).result;

      if (this.form.dirty && this.form.valid) {
        if (!requisicao) {
          await this.requisicaoService.inserir(
            this.form.get('requisicao')?.value
          );
        } else {
          await this.requisicaoService.editar(
            this.form.get('requisicao')?.value
          );
        }
        console.log(`A requisição foi salva com sucesso`);
        this.notificador.notificacaoSucesso(
          'Cadastro de requisições',
          'Requisição cadastrada com sucesso!'
        );
      } else {
        this.notificador.notificacaoErro(
          'Cadastro de requisições',
          'O formulário precisa ser preenchido corretamente!'
        );
      }
    } catch (error) {
      console.log(error);
      if (error !== 0 && error !== 'fechar' && error !== 1) {
        this.notificador.notificacaoErro(
          'Cadastro de requisições',
          'Erro ao cadastrar Requisição!'
        );
      }
    }
  }
}
