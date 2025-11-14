import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { BlockedPeriodService } from '../../services/blocked-period.service';
import { Accommodation } from '../../models/accommodation.model';

@Component({
  selector: 'app-blocked-weekday-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './blocked-weekday-dialog.component.html',
  styleUrls: ['./blocked-weekday-dialog.component.css']
})
export class BlockedWeekdayDialogComponent {
  form: FormGroup;
  loading = signal(false);

  timeError = computed(() => {
    const startTime = this.form.get('start_time')?.value;
    const endTime = this.form.get('end_time')?.value;

    // If both times are provided, validate that end time is after start time
    if (startTime && endTime && startTime !== '' && endTime !== '') {
      if (endTime <= startTime) {
        return 'L\'ora di fine deve essere successiva all\'ora di inizio';
      }
    }

    // If only one time is provided, show error
    if ((startTime && !endTime) || (!startTime && endTime)) {
      return 'Inserisci entrambe le ore o lascia entrambe vuote per tutto il giorno';
    }

    return '';
  });

  constructor(
    private fb: FormBuilder,
    private blockedPeriodService: BlockedPeriodService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<BlockedWeekdayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { accommodations: Accommodation[] }
  ) {
    this.form = this.fb.group({
      accommodation: ['', Validators.required],
      weekday: ['', Validators.required],
      start_time: [''],
      end_time: [''],
      reason: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid && !this.loading() && !this.timeError()) {
      this.loading.set(true);

      const formValue = this.form.value;
      const data = {
        accommodation: formValue.accommodation,
        weekday: formValue.weekday,
        start_time: formValue.start_time || null,
        end_time: formValue.end_time || null,
        reason: formValue.reason
      };

      this.blockedPeriodService.createBlockedWeekday(data).subscribe({
        next: () => {
          this.snackBar.open('Giorno bloccato aggiunto con successo', 'Chiudi', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading.set(false);
          const message = error.error?.detail || error.error?.non_field_errors?.[0] || 'Errore nell\'aggiunta del giorno bloccato';
          this.snackBar.open(message, 'Chiudi', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

