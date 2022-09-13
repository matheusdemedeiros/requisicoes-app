import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, take } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { EquipamentoService } from 'src/app/equipamentos/services/equipamento.service';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Notificador } from 'src/app/shared/notificador.service';
import { Movimentacao } from '../models/movimentacao.model';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-departamento',
  templateUrl: './requisicoes-departamento.component.html',
  styleUrls: ['./requisicoes-departamento.component.css'],
})
export class RequisicoesDepartamentoComponent implements OnInit {
  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public funcionarios$: Observable<Funcionario[]>;
  public form: FormGroup;
  public funcionarioLogado: Funcionario;
  public qtdRequisicoesDepartamento: number;
  public departamentoAtual: Departamento;
  public departamentoAtualId: string;
  public requisicaoSelecionada: Requisicao;
  public listaStatus: string[] = [
    'Aberta',
    'Processando',
    'Não autorizada',
    'Fechada',
  ];

  constructor(
    private fb: FormBuilder,
    private notificador: Notificador,
    private requisicaoService: RequisicaoService,
    private departamentoService: DepartamentoService,
    private equipamentoService: EquipamentoService,
    private funcionarioService: FuncionarioService,
    private modalService: NgbModal,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.qtdRequisicoesDepartamento = 0;
    this.obterDepartamentoIdAtual();

    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.obterDepartamentoAtual();

    console.log('Departamento Atual: ' + this.departamentoAtual);
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(''),
      departamentoId: new FormControl('', Validators.required),
      departamento: new FormControl(''),
      descricao: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      equipamentoId: new FormControl(''),
      equipamento: new FormControl(''),
      dataAbertura: new FormControl(''),
      funcionario: new FormControl(''),
      funcionarioId: new FormControl(''),
      status: new FormControl('', [Validators.required]),
      data: new FormControl('', [Validators.required]),
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
  get status(): AbstractControl | null {
    return this.form.get('status');
  }

  get id(): AbstractControl | null {
    return this.form.get('id');
  }

  public async gravar(modal: TemplateRef<any>, requisicao: Requisicao) {
    this.requisicaoSelecionada = requisicao;
    this.requisicaoSelecionada.movimentacoes = requisicao.movimentacoes
      ? requisicao.movimentacoes
      : [];
    this.form.reset();
    this.configurarValoresPadrao();

    try {
      await this.modalService.open(modal).result;

      if (this.form.dirty && this.form.valid) {
        this.atualizarRequisicao(this.form.value);
        await this.requisicaoService.editar(this.requisicaoSelecionada);
      }

      this.notificador.notificacaoSucesso(
        'Cadastro de requisições',
        'Requisição cadastrada com sucesso!'
      );
    } catch (error) {
      console.log(error);
      if (error !== 0 && error !== 'fechar' && error !== 1) {
        this.notificador.notificacaoErro(
          'Cadastro de requisições',
          'Erro ao salvar Requisição!'
        );
      }
    }
  }
  private atualizarRequisicao(movimentacao: Movimentacao) {
    this.requisicaoSelecionada.movimentacoes.push(movimentacao);
    this.requisicaoSelecionada.status = this.status?.value;
    this.requisicaoSelecionada.ultimaAtualizacao = new Date();
  }

  public obterDepartamentoAtual() {
    this.departamentos$
      .pipe(
        map((departamentos) => {
          let dep = departamentos.filter(
            (d) => d.id === this.departamentoAtualId
          );
          return dep[0];
        })
      )
      .subscribe((d) => (this.departamentoAtual = d));
  }

  public obterDepartamentoIdAtual() {
    this.authService.usuarioLogado.subscribe((dados) => {
      this.funcionarioService
        .selecionarFuncionarioLogado(dados!.email!)
        .subscribe((funcionario) => {
          this.funcionarioLogado = funcionario;
          this.departamentoAtualId = funcionario.departamentoId;
          this.requisicoes$ = this.requisicaoService.selecionarTodos().pipe(
            map((requisicoes) => {
              let requisicoesDepartamentoAtual = requisicoes.filter(
                (r) => r.departamentoId === this.departamentoAtualId
              );
              this.qtdRequisicoesDepartamento =
                requisicoesDepartamentoAtual.length;
              return requisicoesDepartamentoAtual;
            })
          );
        });
    });
  }
  private configurarValoresPadrao(): void {
    this.form.patchValue({
      funcionario: this.funcionarioLogado,
      data: new Date(),
      status: this.requisicaoSelecionada.status,
    });
  }
}
