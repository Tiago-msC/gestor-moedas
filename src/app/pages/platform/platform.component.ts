import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActionDialogComponent } from './components/action-dialog/action-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MoedaService } from '../../core/services/moeda.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-platform',
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './platform.component.html',
  styleUrl: './platform.component.scss',
})
export class PlatformComponent implements OnInit {
  userName: string = '';

  searchTerm: string = '';
  moedas: WritableSignal<any> = signal([]);
  loading: WritableSignal<boolean> = signal(false);
  nextIdMoeda = 0;

  filteredMoedas = computed(() => {
    return this.moedas().filter((moeda: any) => {
      return (
        moeda.sigla.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        moeda.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  });

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private moedaService: MoedaService
  ) {}

  ngOnInit() {
    this.loadMoedas();
    this.getProfile();
  }

  private loadMoedas() {
    this.loading.set(true);
    this.moedaService.getMoedas().subscribe({
      next: (response) => {
        this.moedas.set(response);

        // pegar o maior id e incrementar +1
        const maxId = response.reduce((acc: number, moeda: any) => {
          const id = parseInt(moeda.id, 10);
          return id > acc ? id : acc;
        }, 0) + 1;
        this.nextIdMoeda = maxId.toString() || '1';
        this.loading.set(false);
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar moedas.', 'Fechar', { duration: 3000 });
        this.loading.set(false);
      },
    });
  }

  private getProfile() {
    const profile = this.authService.getProfile();
    this.userName = profile?.name || '';
  }

  logout() {
    this.authService.clearToken();
    this.router.navigate(['/']);
  }

  actionDialog(actions: 'add' | 'view' | 'edit' | 'delete', moeda?: any) {
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      data: {
        mode: actions,
        moeda,
        nextIdMoeda: this.nextIdMoeda,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadMoedas();
      }
    });

  }
}
