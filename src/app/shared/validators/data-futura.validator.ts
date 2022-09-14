import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
export function dataFuturaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dataInserida = moment(control.value);
    const hoje = moment();
    const dataInseridaMaiorQueHoje: boolean = dataInserida.isAfter(hoje);
    return dataInseridaMaiorQueHoje ? { dataFutura: true } : null;
  };
}
