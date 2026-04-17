import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingService } from '../../services/booking.service';
import { ReviewService } from '../../services/review.service';
import { PaidServiceService } from '../../services/paid-service.service';
import { Booking } from '../../models/booking.model';
import { Review } from '../../models/review.model';
import { PaidService } from '../../models/paid-service.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings = signal<Booking[]>([]);
  userReviews = signal<Review[]>([]);
  allServices = signal<PaidService[]>([]);
  loading = signal(true);

  constructor(
    private bookingService: BookingService,
    private reviewService: ReviewService,
    private paidServiceService: PaidServiceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBookings();
    this.loadReviews();
    this.paidServiceService.getPaidServices().subscribe(s => this.allServices.set(s));
  }

  private loadBookings(): void {
    this.loading.set(true);
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Errore nel caricamento delle prenotazioni', 'Chiudi', { duration: 3000 });
      }
    });
  }

  private loadReviews(): void {
    this.reviewService.getReviews().subscribe({
      next: (data) => {
        this.userReviews.set(data);
      },
      error: () => {
        // Silent fail - reviews are supplementary
      }
    });
  }

  hasReview(bookingId: number): boolean {
    return this.userReviews().some(review => review.booking === bookingId);
  }

  canReview(booking: Booking): boolean {
    return booking.status === 'confirmed' && new Date(booking.check_out) < new Date();
  }

  async openReviewDialog(booking: Booking): Promise<void> {
    const { ReviewDialogComponent } = await import('../review-dialog/review-dialog.component');
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      data: {
        bookingId: booking.id,
        accommodationTitle: booking.accommodation_title
      },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadReviews();
      }
    });
  }

  getServiceNames(serviceIds: number[]): PaidService[] {
    return this.allServices().filter(s => serviceIds.includes(s.id));
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'pending': 'warn',
      'confirmed': 'primary',
      'cancelled': '',
      'rejected': 'warn'
    };
    return colors[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pending': 'In Attesa',
      'confirmed': 'Confermata',
      'cancelled': 'Annullata',
      'rejected': 'Rifiutata'
    };
    return labels[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      'pending': 'schedule',
      'confirmed': 'check_circle',
      'cancelled': 'cancel',
      'rejected': 'close'
    };
    return icons[status] || 'help';
  }

  cancelBooking(booking: Booking): void {
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      this.snackBar.open('Impossibile annullare questa prenotazione', 'Chiudi', { duration: 3000 });
      return;
    }

    if (confirm('Sei sicuro di voler annullare questa prenotazione?')) {
      this.bookingService.cancelBooking(booking.id).subscribe({
        next: () => {
          this.snackBar.open('Prenotazione annullata', 'Chiudi', { duration: 3000 });
          this.loadBookings();
        },
        error: () => {
          this.snackBar.open('Errore nell\'annullamento della prenotazione', 'Chiudi', { duration: 3000 });
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  navigateToNewBooking(): void {
    this.router.navigate(['/bookings/new']);
  }
}

