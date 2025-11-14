import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookingService } from '../../services/booking.service';
import { AccommodationService } from '../../services/accommodation.service';
import { BlockedPeriodService } from '../../services/blocked-period.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

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
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  template: `
    <div class="stats-container">
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <div class="stats-grid">
          <mat-card class="stat-card bookings" (click)="navigateTo('bookings')">
            <div class="stat-icon">
              <mat-icon>event_note</mat-icon>
            </div>
            <div class="stat-content">
              <h3>Prenotazioni Totali</h3>
              <p class="stat-number">{{ stats().totalBookings }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card pending" (click)="navigateTo('bookings')">
            <div class="stat-icon">
              <mat-icon>schedule</mat-icon>
            </div>
            <div class="stat-content">
              <h3>In Attesa</h3>
              <p class="stat-number">{{ stats().pendingBookings }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card confirmed" (click)="navigateTo('bookings')">
            <div class="stat-icon">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-content">
              <h3>Confermate</h3>
              <p class="stat-number">{{ stats().confirmedBookings }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card accommodations" (click)="navigateTo('accommodations')">
            <div class="stat-icon">
              <mat-icon>home_work</mat-icon>
            </div>
            <div class="stat-content">
              <h3>Alloggi</h3>
              <p class="stat-number">{{ stats().totalAccommodations }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card blocked-periods" (click)="navigateTo('blocked-periods')">
            <div class="stat-icon">
              <mat-icon>block</mat-icon>
            </div>
            <div class="stat-content">
              <h3>Periodi Bloccati</h3>
              <p class="stat-number">{{ stats().blockedPeriods }}</p>
            </div>
          </mat-card>

          <mat-card class="stat-card blocked-weekdays" (click)="navigateTo('blocked-weekdays')">
            <div class="stat-icon">
              <mat-icon>event_busy</mat-icon>
            </div>
            <div class="stat-content">
              <h3>Giorni Bloccati</h3>
              <p class="stat-number">{{ stats().blockedWeekdays }}</p>
            </div>
          </mat-card>
        </div>

        <div class="quick-actions">
          <h2>Azioni Rapide</h2>
          <div class="actions-grid">
            <button mat-raised-button color="primary" (click)="navigateTo('bookings')">
              <mat-icon>visibility</mat-icon>
              Vedi Tutte le Prenotazioni
            </button>
            <button mat-raised-button color="accent" (click)="navigateTo('accommodations')">
              <mat-icon>add</mat-icon>
              Gestisci Alloggi
            </button>
            <button mat-raised-button (click)="navigateTo('blocked-periods')">
              <mat-icon>event_busy</mat-icon>
              Gestisci Disponibilità
            </button>
          </div>
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
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }

    .stat-card.bookings {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .stat-card.pending {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .stat-card.confirmed {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    .stat-card.accommodations {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      color: white;
    }

    .stat-card.blocked-periods {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      color: white;
    }

    .stat-card.blocked-weekdays {
      background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
      color: white;
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
    }

    .stat-content h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.9;
    }

    .stat-number {
      margin: 0;
      font-size: 32px;
      font-weight: 700;
    }

    .quick-actions {
      margin-top: 40px;
    }

    .quick-actions h2 {
      font-size: 24px;
      margin: 0 0 24px 0;
      color: #333;
    }

    .actions-grid {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .actions-grid button {
      flex: 1;
      min-width: 200px;
      height: 56px;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid button {
        width: 100%;
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
    private blockedPeriodService: BlockedPeriodService,
    private router: Router
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

  navigateTo(section: string): void {
    // Le tab sono gestite dalla dashboard parent, questa è solo una visualizzazione
    // Puoi emettere un evento per cambiare tab se necessario
  }
}

