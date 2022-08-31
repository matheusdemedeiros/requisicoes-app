import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Notificador } from '../shared/notificador.service';
import { Departamento } from './models/departamento.model';
import { DepartamentoService } from './services/departamento.service';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
})
export class DepartamentoComponent implements OnInit {
  public departamentos$: Observable<Departamento[]>;
  public form: FormGroup;

  constructor(
    private departamentoService: DepartamentoService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private notificador: Notificador
  ) {}

  ngOnInit(): void {
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.form = this.fb.group({
      id: new FormControl(''),
      nome: new FormControl(''),
      telefone: new FormControl(''),
    });
  }

  get nome() {
    return this.form.get('nome');
  }

  get id() {
    return this.form.get('id');
  }
  get telefone() {
    return this.form.get('telefone');
  }
  get tituloModal(): string {
    return this.id?.value ? 'Atualização' : 'Cadastro';
  }

  public async gravar(modal: TemplateRef<any>, departamento?: Departamento) {
    this.form.reset();
    if (departamento) {
      this.form.setValue(departamento);
    }

    try {
      await this.modalService.open(modal).result;

      if (!departamento) {
        await this.departamentoService.inserir(this.form.value);
      } else {
        await this.departamentoService.editar(this.form.value);
      }
      console.log(`O departamento foi salvo com sucesso`);
      this.notificador.notificacaoSucesso(
        'Cadastro de departamentos',
        'Departamento cadastrado com sucesso!'
      );
    } catch (error) {
      if (error !== 0 && error !== 'fechar' && error !== 1) {
        this.notificador.notificacaoErro(
          'Cadastro de departamentos',
          'Erro ao  cadastrar departamento!'
        );
      }
    }
  }

  public async excluir(registro: Departamento) {
    try {
      await this.departamentoService.excluir(registro);
      this.notificador.notificacaoSucesso(
        'Exclusão de departamentos',
        'Departamento excluído com sucesso!'
      );
    } catch (error) {
      this.notificador.notificacaoErro(
        'Exclusão de equipamentos',
        'Erro ao excluir o departamento!'
      );
    }
  }
}
