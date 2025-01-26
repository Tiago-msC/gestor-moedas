import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MoedaService } from '../../../../core/services/moeda.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-action-dialog',
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './action-dialog.component.html',
  styleUrl: './action-dialog.component.scss',
})
export class ActionDialogComponent implements OnInit {

  moedaForm: FormGroup;
  mode: 'add' | 'edit' | 'delete' | 'view' = 'add';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MatDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private moedaService: MoedaService,
    private snackBar: MatSnackBar,
  ) {

    this.moedaForm = this.fb.group({
      id: [data.moeda?.id],
      sigla: [data.moeda?.sigla, Validators.required],
      nome: [data.moeda?.nome, Validators.required],
      simbolo: [data.moeda?.simbolo, Validators.required],
      codigo: [data.moeda?.codigo],
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
      console.warn(this.moedaForm.value);
      const moeda = this.moedaForm.value;

      if (this.mode === 'add') {
        moeda.id = this.data?.nextIdMoeda || "1";
        this.moedaService.addMoeda(moeda).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            this.snackBar.open('Erro ao adicionar moeda.', 'Fechar', { duration: 3000 });
          },
        });
      } else if (this.mode === 'edit') {
        this.moedaService.updateMoeda(moeda?.id, moeda).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            this.snackBar.open('Erro ao atualizar moeda.', 'Fechar', { duration: 3000 });
          },
        });
      } else if (this.mode === 'delete') {
        this.moedaService.deleteMoeda(moeda?.id).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            this.snackBar.open('Erro ao deletar moeda.', 'Fechar', { duration: 3000 });
          },
        });
      } else if (this.mode === 'view') {
        this.dialogRef.close();
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
