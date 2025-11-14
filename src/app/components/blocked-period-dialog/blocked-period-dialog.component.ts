import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { BlockedPeriodService } from '../../services/blocked-period.service';
import { Accommodation } from '../../models/accommodation.model';

@Component({
  selector: 'app-blocked-period-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './blocked-period-dialog.component.html',
  styleUrls: ['./blocked-period-dialog.component.css']
})
export class BlockedPeriodDialogComponent {
  form: FormGroup;
  loading = signal(false);

  dateError = computed(() => {
    const startDate = this.form.get('start_date')?.value;
    const endDate = this.form.get('end_date')?.value;

    if (startDate && endDate) {
      if (endDate < startDate) {
        return 'La data di fine deve essere successiva alla data di inizio';
      }
    }
    return '';
  });

  constructor(
    private fb: FormBuilder,
    private blockedPeriodService: BlockedPeriodService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<BlockedPeriodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { accommodations: Accommodation[] }
  ) {
    this.form = this.fb.group({
      accommodation: ['', Validators.required],
      start_date: ['', Validators.required],
      start_time: ['00:00', Validators.required],
      end_date: ['', Validators.required],
      end_time: ['23:59', Validators.required],
      reason: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid && !this.loading() && !this.dateError()) {
      this.loading.set(true);

      const formValue = this.form.value;
      const startDate = this.formatDateTime(formValue.start_date, formValue.start_time);
      const endDate = this.formatDateTime(formValue.end_date, formValue.end_time);

      const data = {
        accommodation: formValue.accommodation,
        start_date: startDate,
        end_date: endDate,
        reason: formValue.reason
      };

      this.blockedPeriodService.createBlockedPeriod(data).subscribe({
        next: () => {
          this.snackBar.open('Periodo bloccato aggiunto con successo', 'Chiudi', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading.set(false);
          const message = error.error?.detail || 'Errore nell\'aggiunta del periodo bloccato';
          this.snackBar.open(message, 'Chiudi', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private formatDateTime(date: Date, time: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T${time}:00Z`;
  }
}

