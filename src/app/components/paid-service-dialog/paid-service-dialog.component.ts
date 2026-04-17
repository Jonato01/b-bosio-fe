import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PaidServiceService } from '../../services/paid-service.service';
import { PaidService } from '../../models/paid-service.model';
import { Accommodation } from '../../models/accommodation.model';

@Component({
  selector: 'app-paid-service-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './paid-service-dialog.component.html',
  styleUrls: ['./paid-service-dialog.component.css']
})
export class PaidServiceDialogComponent {
  form: FormGroup;
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private paidServiceService: PaidServiceService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PaidServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { service: PaidService | null; accommodations: Accommodation[] }
  ) {
    const service = data.service;
    this.form = this.fb.group({
      accommodation: [service?.accommodation || null, Validators.required],
      name: [service?.name || '', Validators.required],
      description: [service?.description || ''],
      price: [service?.price || null, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid && !this.loading()) {
      this.loading.set(true);
      const formValue = this.form.value;

      if (this.data.service) {
        this.paidServiceService.updatePaidService(this.data.service.id, formValue).subscribe({
          next: (result) => {
            this.snackBar.open('Servizio aggiornato con successo', 'Chiudi', { duration: 3000 });
            this.dialogRef.close(result);
          },
          error: (error) => {
            this.loading.set(false);
            const message = error.error?.detail || 'Errore nell\'aggiornamento del servizio';
            this.snackBar.open(message, 'Chiudi', { duration: 3000 });
          }
        });
      } else {
        this.paidServiceService.createPaidService(formValue).subscribe({
          next: (result) => {
            this.snackBar.open('Servizio creato con successo', 'Chiudi', { duration: 3000 });
            this.dialogRef.close(result);
          },
          error: (error) => {
            this.loading.set(false);
            const message = error.error?.detail || 'Errore nella creazione del servizio';
            this.snackBar.open(message, 'Chiudi', { duration: 3000 });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
