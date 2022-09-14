import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, Subscription, take } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Notificador } from 'src/app/shared/notificador.service';
import { Movimentacao } from '../models/movimentacao.model';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-departamento',
  templateUrl: './requisicoes-departamento.component.html',
})
export class RequisicoesDepartamentoComponent implements OnInit, OnDestroy {
  public requisicoes$: Observable<Requisicao[]>;
  public form: FormGroup;
  public funcionarioLogado: Funcionario;
  public requisicaoSelecionada: Requisicao;
  public departamentoAtual: Departamento;

  public listaStatus: string[] = [
    'Aberta',
    'Processando',
    'Não autorizada',
    'Fechada',
  ];
  private processoAutenticado$: Subscription;

  constructor(
    private fb: FormBuilder,
    private notificador: Notificador,
    private requisicaoService: RequisicaoService,
    private funcionarioService: FuncionarioService,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private departamentoService: DepartamentoService
  ) {}
  ngOnDestroy(): void {
    this.processoAutenticado$.unsubscribe();
  }

  ngOnInit(): void {
    this.processoAutenticado$ = this.authService.usuarioLogado.subscribe(
      (dados) => {
        this.funcionarioService
          .selecionarFuncionarioLogado(dados!.email!)
          .subscribe((funcionario) => {
            this.funcionarioLogado = funcionario;
            this.departamentoService
              .selecionarPorId(this.funcionarioLogado.departamentoId)
              .subscribe((dep) => {
                this.departamentoAtual = dep;
              });

            //implementação feita pelo service
            // this.requisicoes$ =
            //   this.requisicaoService.selecionarRequisicoesPorDepartamentoId(
            //     funcionario.departamentoId
            //   );
            //implementação feita com a utilização do pipe
            this.requisicoes$ = this.requisicaoService.selecionarTodos();
          });
      }
    );

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
      ultimaAtualizacao: new FormControl(''),
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

  private configurarValoresPadrao(): void {
    this.form.patchValue({
      funcionario: this.funcionarioLogado,
      data: new Date(),
      status: this.requisicaoSelecionada.status,
    });
  }
}
