import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Notificador } from '../shared/notificador.service';

import { Equipamento } from './models/equipamento.model';
import { EquipamentoService } from './services/equipamento.service';

@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html',
})
export class EquipamentoComponent implements OnInit {
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(
    private equipamentoService: EquipamentoService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private notificador: Notificador
  ) {}

  ngOnInit(): void {
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
    this.form = this.fb.group({
      id: new FormControl(''),
      numeroSerie: new FormControl(''),
      nome: new FormControl(''),
      precoAquisicao: new FormControl(''),
      dataFabricacao: new FormControl(''),
    });
  }
  get id() {
    return this.form.get('id');
  }
  get nome() {
    return this.form.get('nome');
  }
  get numeroSerie() {
    return this.form.get('numeroSerie');
  }
  get precoAquisicao() {
    return this.form.get('precoAquisicao');
  }
  get dataFabricacao() {
    return this.form.get('dataFabricacao');
  }
  get tituloModal(): string {
    return this.id?.value ? 'Atualização' : 'Cadastro';
  }

  public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento) {
    this.form.reset();
    if (equipamento) {
      this.form.setValue(equipamento);
    }

    try {
      await this.modalService.open(modal).result;

      if (!equipamento) {
        await this.equipamentoService.inserir(this.form.value);
      } else {
        await this.equipamentoService.editar(this.form.value);
      }
      console.log(`O equipamento foi salvo com sucesso`);
      this.notificador.notificacaoSucesso(
        'Cadastro de equipamentos',
        'Equipamento cadastrado com sucesso!'
      );
    } catch (error) {
      if (error !== 'fechar') {
        this.notificador.notificacaoErro(
          'Cadastro de equipamentos',
          'Erro ao cadastrar equipamento!'
        );
      }
    }
  }
  public excluir(registro: Equipamento) {
    this.equipamentoService.excluir(registro);
    this.notificador.notificacaoSucesso(
      'Exclusão de equipamentos',
      'Equipamento excluído com sucesso!'
    );
  }
}
