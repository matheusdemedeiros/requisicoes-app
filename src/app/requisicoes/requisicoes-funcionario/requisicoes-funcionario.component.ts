import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { EquipamentoService } from 'src/app/equipamentos/services/equipamento.service';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Notificador } from 'src/app/shared/notificador.service';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-resuisicoes-funcionario',
  templateUrl: './requisicoes-funcionario.component.html',
})
export class ResuisicoesFuncionarioComponent implements OnInit {
  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public funcionarios$: Observable<Funcionario[]>;
  public form: FormGroup;
  public funcionarioLogado: Funcionario;
  public qtdRequisicoesFuncionario: number;

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
    this.qtdRequisicoesFuncionario = 0;
    this.obterFuncionarioLogado();
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
      dataAbertura: new FormControl(''),
      funcionario: new FormControl(''),
      funcionarioId: new FormControl(''),

      status: new FormControl(''),
      ultimaAtualizacao: new FormControl(''),
      movimentacoes: new FormControl(''),
    });
  }

  get departamentoId(): AbstractControl | null {
    return this.form.get('departamentoId');
  }
  get funcionarioId(): AbstractControl | null {
    return this.form.get('funcionarioId');
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
  get status(): AbstractControl | null {
    return this.form.get('status');
  }

  get tituloModal(): string {
    return this.id?.value ? 'Atualização' : 'Cadastro';
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset();
    this.configurarValoresPadrao();
    if (requisicao) {
      const departamento = requisicao.departamento
        ? requisicao.departamento
        : null;
      const equipamento = requisicao.equipamento
        ? requisicao.equipamento
        : null;
      const funcionario = requisicao.funcionario
        ? requisicao.funcionario
        : null;

      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        equipamento,
        funcionario,
      };

      this.form.setValue(requisicaoCompleta);
    }

    try {
      await this.modalService.open(modal).result;

      if (!requisicao) {
        await this.requisicaoService.inserir(
          this.form.value,
          this.funcionarioLogado
        );
      } else {
        await this.requisicaoService.editar(this.form.value);
      }

      console.log(`A requisição foi salva com sucesso`);
      this.notificador.notificacaoSucesso(
        'Cadastro de requisições',
        'Requisição cadastrada com sucesso!'
      );
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

  public async excluir(registro: Requisicao) {
    try {
      await this.requisicaoService.excluir(registro);
      this.notificador.notificacaoSucesso(
        'Exclusão de requisição',
        'Requisição excluída com sucesso!'
      );
    } catch (error) {
      this.notificador.notificacaoErro(
        'Exclusão de Requisições',
        'Erro ao excluir o Requisição!'
      );
    }
  }

  public obterFuncionarioLogado() {
    this.authService.usuarioLogado.subscribe((dados) => {
      this.funcionarioService
        .selecionarFuncionarioLogado(dados!.email!)
        .subscribe((funcionario) => {
          this.funcionarioLogado = funcionario;
          this.requisicoes$ = this.requisicaoService.selecionarTodos().pipe(
            map((requisicoes) => {
              let requisicoesFuncionario = requisicoes.filter(
                (r) => r.funcionario.email === this.funcionarioLogado.email
              );
              this.qtdRequisicoesFuncionario = requisicoesFuncionario?.length;
              return requisicoesFuncionario;
            })
          );
        });
    });
  }

  private configurarValoresPadrao() {
    this.form.get("status")?.setValue("Aberta");
    this.form.get("dataAbertura")?.setValue(new Date());
    this.form.get("ultimaAtualizacao")?.setValue(new Date());
    this.form.get("equipamentoId")?.setValue(null);
    this.form.get("funcionarioId")?.setValue(this.funcionarioLogado.id);

  }
}
