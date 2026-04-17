import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-review-dialog',
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
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.css']
})
export class ReviewDialogComponent {
  form: FormGroup;
  loading = signal(false);
  rating = signal(0);
  hoveredRating = signal(0);
  stars = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bookingId: number; accommodationTitle: string }
  ) {
    this.form = this.fb.group({
      comment: ['']
    });
  }

  setRating(value: number): void {
    this.rating.set(value);
  }

  setHoveredRating(value: number): void {
    this.hoveredRating.set(value);
  }

  isStarFilled(index: number): boolean {
    const displayRating = Math.max(this.rating(), this.hoveredRating());
    return index < displayRating;
  }

  onSubmit(): void {
    if (this.rating() === 0) {
      this.snackBar.open('Seleziona una valutazione', 'Chiudi', { duration: 3000 });
      return;
    }

    if (!this.loading()) {
      this.loading.set(true);

      const reviewData = {
        booking: this.data.bookingId,
        rating: this.rating(),
        comment: this.form.value.comment || undefined
      };

      this.reviewService.createReview(reviewData).subscribe({
        next: (result) => {
          this.snackBar.open('Recensione inviata con successo', 'Chiudi', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: (error) => {
          this.loading.set(false);
          const message = error.error?.detail || 'Errore nell\'invio della recensione';
          this.snackBar.open(message, 'Chiudi', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
