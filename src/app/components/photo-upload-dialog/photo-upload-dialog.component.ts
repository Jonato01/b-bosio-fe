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
import { PhotoService } from '../../services/photo.service';
import { Accommodation } from '../../models/accommodation.model';

@Component({
  selector: 'app-photo-upload-dialog',
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
  templateUrl: './photo-upload-dialog.component.html',
  styleUrls: ['./photo-upload-dialog.component.css']
})
export class PhotoUploadDialogComponent {
  form: FormGroup;
  loading = signal(false);
  selectedFile = signal<File | null>(null);

  constructor(
    private fb: FormBuilder,
    private photoService: PhotoService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PhotoUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { accommodations: Accommodation[] }
  ) {
    this.form = this.fb.group({
      accommodation: [null, Validators.required],
      caption: ['']
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    } else {
      this.selectedFile.set(null);
    }
  }

  onSubmit(): void {
    const file = this.selectedFile();
    if (this.form.valid && file && !this.loading()) {
      this.loading.set(true);
      const formValue = this.form.value;

      this.photoService.uploadPhoto(formValue.accommodation, file, 'accommodation', formValue.caption || '').subscribe({
        next: (result) => {
          this.snackBar.open('Foto caricata con successo', 'Chiudi', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: (error) => {
          this.loading.set(false);
          const message = error.error?.detail || 'Errore nel caricamento della foto';
          this.snackBar.open(message, 'Chiudi', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
