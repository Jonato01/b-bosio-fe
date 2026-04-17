import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookingService } from '../../services/booking.service';
import { AccommodationService } from '../../services/accommodation.service';
import { BlockedPeriodService } from '../../services/blocked-period.service';

interface Statistics {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  rejectedBookings: number;
  totalAccommodations: number;
  blockedPeriods: number;
  blockedWeekdays: number;
}

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="stats-container">
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <div class="stats-grid">
          <mat-card class="stat-card">
            <div class="stat-icon">
              <mat-icon>event_note</mat-icon>
            </div>
            <div class="stat-content">
              <h3>Prenotazioni Totali</h3>
              <p class="stat-number">{{ stats().totalBookings }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-icon">
              <mat-icon>schedule</mat-icon>
            </div>
            <div class="stat-content">
              <h3>In Attesa</h3>
              <p class="stat-number">{{ stats().pendingBookings }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-icon">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-content">
              <h3>Confermate</h3>
              <p class="stat-number">{{ stats().confirmedBookings }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-icon">
              <mat-icon>home_work</mat-icon>
            </div>
            <div class="stat-content">
              <h3>Alloggi</h3>
              <p class="stat-number">{{ stats().totalAccommodations }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-icon">
              <mat-icon>block</mat-icon>
            </div>
            <div class="stat-content">
              <h3>Periodi Bloccati</h3>
              <p class="stat-number">{{ stats().blockedPeriods }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-icon">
              <mat-icon>event_busy</mat-icon>
            </div>
            <div class="stat-content">
              <h3>Giorni Bloccati</h3>
              <p class="stat-number">{{ stats().blockedWeekdays }}</p>
            </div>
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .stats-container {
      padding: 24px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 60px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      cursor: default;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--accent-color);
    }

    .stat-content h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-secondary);
    }

    .stat-number {
      margin: 0;
      font-size: 32px;
      font-weight: 700;
      color: var(--text-primary);
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminStatsComponent implements OnInit {
  stats = signal<Statistics>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    rejectedBookings: 0,
    totalAccommodations: 0,
    blockedPeriods: 0,
    blockedWeekdays: 0
  });
  loading = signal(true);

  constructor(
    private bookingService: BookingService,
    private accommodationService: AccommodationService,
    private blockedPeriodService: BlockedPeriodService
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    this.loading.set(true);

    Promise.all([
      this.loadBookingStats(),
      this.loadAccommodationStats(),
      this.loadBlockedPeriodStats()
    ]).finally(() => this.loading.set(false));
  }

  private async loadBookingStats(): Promise<void> {
    return new Promise((resolve) => {
      this.bookingService.getBookings().subscribe({
        next: (response) => {
          const bookings = response.results;
          this.stats.update(stats => ({
            ...stats,
            totalBookings: bookings.length,
            pendingBookings: bookings.filter(b => b.status === 'pending').length,
            confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
            cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
            rejectedBookings: bookings.filter(b => b.status === 'rejected').length
          }));
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  private async loadAccommodationStats(): Promise<void> {
    return new Promise((resolve) => {
      this.accommodationService.getAccommodations().subscribe({
        next: (accommodations) => {
          this.stats.update(stats => ({
            ...stats,
            totalAccommodations: accommodations.length
          }));
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  private async loadBlockedPeriodStats(): Promise<void> {
    return new Promise((resolve) => {
      Promise.all([
        new Promise<void>((res) => {
          this.blockedPeriodService.getBlockedPeriods().subscribe({
            next: (periods) => {
              this.stats.update(stats => ({
                ...stats,
                blockedPeriods: periods.length
              }));
              res();
            },
            error: () => res()
          });
        }),
        new Promise<void>((res) => {
          this.blockedPeriodService.getBlockedWeekdays().subscribe({
            next: (weekdays) => {
              this.stats.update(stats => ({
                ...stats,
                blockedWeekdays: weekdays.length
              }));
              res();
            },
            error: () => res()
          });
        })
      ]).then(() => resolve());
    });
  }
}

