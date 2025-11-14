import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccommodationService } from '../../services/accommodation.service';
import { Accommodation } from '../../models/accommodation.model';

@Component({
  selector: 'app-manage-accommodations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './manage-accommodations.component.html',
  styleUrls: ['./manage-accommodations.component.css']
})
export class ManageAccommodationsComponent implements OnInit {
  private _accommodations = signal<Accommodation[]>([]);
  accommodations = computed(() => {
    const data = this._accommodations();
    return Array.isArray(data) ? data : [];
  });

  accommodationForm: FormGroup;
  loading = signal(false);
  editingId = signal<number | null>(null);

  constructor(
    private fb: FormBuilder,
    private accommodationService: AccommodationService,
    private snackBar: MatSnackBar
  ) {
    this.accommodationForm = this.fb.group({
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAccommodations();
  }

  private loadAccommodations(): void {
    this.loading.set(true);
    this.accommodationService.getAccommodations().subscribe({
      next: (data) => {
        // Ensure data is always an array
        this._accommodations.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this._accommodations.set([]); // Reset to empty array on error
        this.snackBar.open('Errore nel caricamento degli alloggi', 'Chiudi', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.accommodationForm.valid && !this.loading()) {
      this.loading.set(true);
      const formValue = this.accommodationForm.value;

      if (this.editingId()) {
        // Update existing
        this.accommodationService.updateAccommodation(formValue.slug, formValue).subscribe({
          next: () => {
            this.snackBar.open('Alloggio aggiornato con successo', 'Chiudi', { duration: 3000 });
            this.loadAccommodations();
            this.resetForm();
          },
          error: (error) => {
            this.loading.set(false);
            const message = error.error?.detail || 'Errore nell\'aggiornamento dell\'alloggio';
            this.snackBar.open(message, 'Chiudi', { duration: 3000 });
          }
        });
      } else {
        // Create new
        this.accommodationService.createAccommodation(formValue).subscribe({
          next: () => {
            this.snackBar.open('Alloggio creato con successo', 'Chiudi', { duration: 3000 });
            this.loadAccommodations();
            this.resetForm();
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

  editAccommodation(accommodation: Accommodation): void {
    this.editingId.set(accommodation.id);
    this.accommodationForm.patchValue({
      slug: accommodation.slug,
      title: accommodation.title,
      description: accommodation.description
    });
    // Disable slug field when editing
    this.accommodationForm.get('slug')?.disable();
  }

  deleteAccommodation(accommodation: Accommodation): void {
    if (confirm(`Sei sicuro di voler eliminare "${accommodation.title}"?`)) {
      this.accommodationService.deleteAccommodation(accommodation.slug).subscribe({
        next: () => {
          this.snackBar.open('Alloggio eliminato', 'Chiudi', { duration: 3000 });
          this.loadAccommodations();
        },
        error: () => {
          this.snackBar.open('Errore nell\'eliminazione dell\'alloggio', 'Chiudi', { duration: 3000 });
        }
      });
    }
  }

  resetForm(): void {
    this.accommodationForm.reset();
    this.accommodationForm.get('slug')?.enable();
    this.editingId.set(null);
    this.loading.set(false);
  }
}

