import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Notificador } from '../shared/notificador.service';
import { Funcionario } from './models/funcionario.model';
import { FuncionarioService } from './services/funcionario.service';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
})
export class FuncionarioComponent implements OnInit {
  public funcionarios$: Observable<Funcionario[]>;
  public departamentos$: Observable<Departamento[]>;
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notificador: Notificador,
    private funcionarioService: FuncionarioService,
    private departamentoService: DepartamentoService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(''),
      nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      funcao: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      departamentoId: new FormControl('', Validators.required),
      departamento: new FormControl(''),
    });

    this.funcionarios$ = this.funcionarioService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
  }
  get id(): AbstractControl | null {
    return this.form.get('id');
  }
  get nome(): AbstractControl | null {
    return this.form.get('nome');
  }
  get email(): AbstractControl | null {
    return this.form.get('email');
  }
  get funcao(): AbstractControl | null {
    return this.form.get('funcao');
  }
  get departamentoId(): AbstractControl | null {
    return this.form.get('departamentoId');
  }

  get departamento(): AbstractControl | null {
    return this.form.get('departamento');
  }
  get tituloModal(): string {
    return this.id?.value ? 'Atualização' : 'Cadastro';
  }

  public async gravar(modal: TemplateRef<any>, funcionario?: Funcionario) {
    this.form.reset();
    if (funcionario) {
      const departamento = funcionario.departamento
        ? funcionario.departamento
        : null;

      const funcionarioCompleto = {
        ...funcionario,
        departamento,
      };

      this.form.setValue(funcionarioCompleto);
    }

    try {
      await this.modalService.open(modal).result;

      if (this.form.dirty && this.form.valid) {
        if (!funcionario) {
          await this.funcionarioService.inserir(this.form.value);
        } else {
          await this.funcionarioService.editar(this.form.value);
        }
        console.log(`O funcionário foi salvo com sucesso`);
        this.notificador.notificacaoSucesso(
          'Cadastro de funcionários',
          'Funcionário cadastrado com sucesso!'
        );
      }
      else{
        this.notificador.notificacaoErro(
          'Cadastro de funcionários',
          'O formulário precisa ser preenchido corretamente!'
        );
      }

    } catch (error) {
      console.log(error);
      if (error !== 0 && error !== 'fechar' && error !== 1) {
        this.notificador.notificacaoErro(
          'Cadastro de funcionários',
          'Erro ao cadastrar Funcionário!'
        );
      }
    }
  }
  public async excluir(registro: Funcionario) {
    try {
      await this.funcionarioService.excluir(registro);
      this.notificador.notificacaoSucesso(
        'Exclusão de funcionário',
        'Funcionário excluído com sucesso!'
      );
    } catch (error) {
      this.notificador.notificacaoErro(
        'Exclusão de funcionários',
        'Erro ao excluir o funcionário!'
      );
    }
  }
}