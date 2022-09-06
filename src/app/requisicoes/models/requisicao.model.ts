import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';

export class Requisicao {
  id: string;
  descricao: string;
  funcionario: Funcionario;
  funcionarioId: string;
  departamento?: Departamento;
  departamentoId: string;
  dataAbertura: string;
  equipamento?: Equipamento;
  equipamentoId?: string;
}
