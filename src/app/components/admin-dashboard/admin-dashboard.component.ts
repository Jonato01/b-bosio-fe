import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BookingService } from '../../services/booking.service';
import { BlockedPeriodService } from '../../services/blocked-period.service';
import { AccommodationService } from '../../services/accommodation.service';
import { Booking } from '../../models/booking.model';
import { BlockedPeriod, BlockedWeekday } from '../../models/blocked-period.model';
import { Accommodation } from '../../models/accommodation.model';
import { ManageAccommodationsComponent } from '../manage-accommodations/manage-accommodations.component';
import { AdminStatsComponent } from '../admin-stats/admin-stats.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    ManageAccommodationsComponent,
    AdminStatsComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  bookings = signal<Booking[]>([]);
  blockedPeriods = signal<BlockedPeriod[]>([]);
  blockedWeekdays = signal<BlockedWeekday[]>([]);
  accommodations = signal<Accommodation[]>([]);
  loading = signal(true);

  bookingsColumns = ['id', 'accommodation', 'user', 'check_in', 'check_out', 'status', 'actions'];
  blockedPeriodsColumns = ['accommodation', 'start_date', 'end_date', 'reason', 'actions'];
  blockedWeekdaysColumns = ['accommodation', 'weekday', 'reason', 'actions'];

  weekdayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

  // MatTableDataSource for mat-table
  bookingsData = new MatTableDataSource<Booking>([]);
  blockedPeriodsData = new MatTableDataSource<BlockedPeriod>([]);
  blockedWeekdaysData = new MatTableDataSource<BlockedWeekday>([]);

  constructor(
    private bookingService: BookingService,
    private blockedPeriodService: BlockedPeriodService,
    private accommodationService: AccommodationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);

    // Load all data in parallel
    Promise.all([
      this.loadBookings(),
      this.loadBlockedPeriods(),
      this.loadBlockedWeekdays(),
      this.loadAccommodations()
    ]).finally(() => this.loading.set(false));
  }

  private async loadBookings(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bookingService.getBookings().subscribe({
        next: (response) => {
          this.bookings.set(response.results);
          this.bookingsData.data = response.results; // Update MatTableDataSource
          resolve();
        },
        error: (err) => {
          this.snackBar.open('Errore nel caricamento prenotazioni', 'Chiudi', { duration: 3000 });
          reject(err);
        }
      });
    });
  }

  private async loadBlockedPeriods(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.blockedPeriodService.getBlockedPeriods().subscribe({
        next: (data) => {
          // Ensure data is always an array
          const periods = Array.isArray(data) ? data : [];
          this.blockedPeriods.set(periods);
          this.blockedPeriodsData.data = periods; // Update MatTableDataSource
          resolve();
        },
        error: (err) => {
          this.blockedPeriods.set([]);
          this.blockedPeriodsData.data = [];
          this.snackBar.open('Errore nel caricamento periodi bloccati', 'Chiudi', { duration: 3000 });
          reject(err);
        }
      });
    });
  }

  private async loadBlockedWeekdays(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.blockedPeriodService.getBlockedWeekdays().subscribe({
        next: (data) => {
          // Ensure data is always an array
          const weekdays = Array.isArray(data) ? data : [];
          this.blockedWeekdays.set(weekdays);
          this.blockedWeekdaysData.data = weekdays; // Update MatTableDataSource
          resolve();
        },
        error: (err) => {
          this.blockedWeekdays.set([]);
          this.blockedWeekdaysData.data = [];
          this.snackBar.open('Errore nel caricamento giorni bloccati', 'Chiudi', { duration: 3000 });
          reject(err);
        }
      });
    });
  }

  private async loadAccommodations(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.accommodationService.getAccommodations().subscribe({
        next: (data) => {
          // Ensure data is always an array
          this.accommodations.set(Array.isArray(data) ? data : []);
          resolve();
        },
        error: (err) => {
          this.accommodations.set([]); // Reset to empty array on error
          reject(err);
        }
      });
    });
  }

  confirmBooking(booking: Booking): void {
    if (booking.status !== 'pending') {
      this.snackBar.open('Solo prenotazioni in attesa possono essere confermate', 'Chiudi', { duration: 3000 });
      return;
    }

    this.bookingService.confirmBooking(booking.id).subscribe({
      next: () => {
        this.snackBar.open('Prenotazione confermata', 'Chiudi', { duration: 3000 });
        this.loadBookings(); // This will update bookingsData
      },
      error: () => {
        this.snackBar.open('Errore nella conferma', 'Chiudi', { duration: 3000 });
      }
    });
  }

  rejectBooking(booking: Booking): void {
    if (booking.status !== 'pending') {
      this.snackBar.open('Solo prenotazioni in attesa possono essere rifiutate', 'Chiudi', { duration: 3000 });
      return;
    }

    if (confirm('Sei sicuro di voler rifiutare questa prenotazione?')) {
      this.bookingService.rejectBooking(booking.id).subscribe({
        next: () => {
          this.snackBar.open('Prenotazione rifiutata', 'Chiudi', { duration: 3000 });
          this.loadBookings(); // This will update bookingsData
        },
        error: () => {
          this.snackBar.open('Errore nel rifiuto', 'Chiudi', { duration: 3000 });
        }
      });
    }
  }

  async openBlockedPeriodDialog(): Promise<void> {
    const accommodationsList = this.accommodations();
    const module = await import('../blocked-period-dialog/blocked-period-dialog.component');
    const dialogRef = this.dialog.open(module.BlockedPeriodDialogComponent, {
      width: '600px',
      data: { accommodations: Array.isArray(accommodationsList) ? accommodationsList : [] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBlockedPeriods(); // This will update blockedPeriodsData
      }
    });
  }

  async openBlockedWeekdayDialog(): Promise<void> {
    const accommodationsList = this.accommodations();
    const module = await import('../blocked-weekday-dialog/blocked-weekday-dialog.component');
    const dialogRef = this.dialog.open(module.BlockedWeekdayDialogComponent, {
      width: '600px',
      data: { accommodations: Array.isArray(accommodationsList) ? accommodationsList : [] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBlockedWeekdays(); // This will update blockedWeekdaysData
      }
    });
  }

  deleteBlockedPeriod(period: BlockedPeriod): void {
    if (confirm('Sei sicuro di voler eliminare questo periodo bloccato?')) {
      this.blockedPeriodService.deleteBlockedPeriod(period.id).subscribe({
        next: () => {
          this.snackBar.open('Periodo bloccato eliminato', 'Chiudi', { duration: 3000 });
          this.loadBlockedPeriods(); // This will update blockedPeriodsData
        },
        error: () => {
          this.snackBar.open('Errore nell\'eliminazione', 'Chiudi', { duration: 3000 });
        }
      });
    }
  }

  deleteBlockedWeekday(weekday: BlockedWeekday): void {
    if (confirm('Sei sicuro di voler eliminare questo giorno bloccato?')) {
      this.blockedPeriodService.deleteBlockedWeekday(weekday.id).subscribe({
        next: () => {
          this.snackBar.open('Giorno bloccato eliminato', 'Chiudi', { duration: 3000 });
          this.loadBlockedWeekdays(); // This will update blockedWeekdaysData
        },
        error: () => {
          this.snackBar.open('Errore nell\'eliminazione', 'Chiudi', { duration: 3000 });
        }
      });
    }
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

  getWeekdayName(weekday: number): string {
    return this.weekdayNames[weekday] || 'N/A';
  }
}
