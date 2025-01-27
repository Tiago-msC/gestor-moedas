import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MoedaService } from '../../../../core/services/moeda.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss'],
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogActions,
  ],
})
export class ActionDialogComponent implements OnInit {
  moedaForm: FormGroup;
  mode: 'add' | 'edit' | 'delete' | 'view' = 'add';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private moedaService: MoedaService,
    private snackBar: MatSnackBar,
  ) {
    this.moedaForm = this.fb.group({
      id: [data.moeda?.id],
      guidEmpresa: [""],
      sigla: [
        data.moeda?.sigla,
        [Validators.required, Validators.pattern(/^[A-Z]{3}$/)],
      ],
      nome: [
        data.moeda?.nome,
        [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
      ],
      simbolo: [
        data.moeda?.simbolo || '',
        [Validators.pattern(/^([^\s,]+(,[^\s,]+)*)?$/)],
      ],
      codigo: [
        data.moeda?.codigo || '',
        [Validators.min(1), Validators.max(999)],
      ],
    });
  }

  ngOnInit() {
    this.mode = this.data?.mode || 'add';
    if (['delete', 'view'].includes(this.mode)) {
      this.moedaForm.disable();
    }
  }

  onSubmit() {
    if (this.moedaForm.valid || this.mode === 'delete') {
      const moeda = this.moedaForm.value;

      const actions = {
        add: () => {
          moeda.id = this.data?.nextIdMoeda || "1";
          moeda.guidEmpresa = uuid();
          this.moedaService.addMoeda(moeda).subscribe(this.handleResponse('adicionar'));
        },
        edit: () => this.moedaService.updateMoeda(moeda.id, moeda).subscribe(this.handleResponse('atualizar')),
        delete: () => this.moedaService.deleteMoeda(moeda.id).subscribe(this.handleResponse('deletar')),
        view: () => this.dialogRef.close(),
      };

      actions[this.mode]();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private handleResponse(action: string) {
    return {
      next: (response: any) => this.dialogRef.close(response),
      error: () => this.snackBar.open(`Erro ao ${action} moeda.`, 'Fechar', { duration: 3000 }),
    };
  }
}
