import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AccommodationService } from '../../services/accommodation.service';
import { Accommodation } from '../../models/accommodation.model';

@Component({
  selector: 'app-accommodation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './accommodation-dialog.component.html',
  styleUrls: ['./accommodation-dialog.component.css']
})
export class AccommodationDialogComponent {
  form: FormGroup;
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private accommodationService: AccommodationService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AccommodationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Accommodation | null
  ) {
    this.form = this.fb.group({
      slug: [
        { value: data?.slug || '', disabled: !!data },
        [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]
      ],
      title: [data?.title || '', Validators.required],
      description: [data?.description || '']
    });
  }

  onSubmit(): void {
    if (this.form.valid && !this.loading()) {
      this.loading.set(true);
      const formValue = this.form.getRawValue();

      if (this.data) {
        this.accommodationService.updateAccommodation(this.data.slug, formValue).subscribe({
          next: (result) => {
            this.snackBar.open('Alloggio aggiornato con successo', 'Chiudi', { duration: 3000 });
            this.dialogRef.close(result);
          },
          error: (error) => {
            this.loading.set(false);
            const message = error.error?.detail || 'Errore nell\'aggiornamento dell\'alloggio';
            this.snackBar.open(message, 'Chiudi', { duration: 3000 });
          }
        });
      } else {
        this.accommodationService.createAccommodation(formValue).subscribe({
          next: (result) => {
            this.snackBar.open('Alloggio creato con successo', 'Chiudi', { duration: 3000 });
            this.dialogRef.close(result);
          },
          error: (error) => {
            this.loading.set(false);
            const message = error.error?.slug?.[0] || error.error?.detail || 'Errore nella creazione dell\'alloggio';
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
