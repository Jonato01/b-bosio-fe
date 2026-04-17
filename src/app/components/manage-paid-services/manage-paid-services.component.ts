import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PaidServiceService } from '../../services/paid-service.service';
import { AccommodationService } from '../../services/accommodation.service';
import { PaidService } from '../../models/paid-service.model';
import { Accommodation } from '../../models/accommodation.model';

@Component({
  selector: 'app-manage-paid-services',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './manage-paid-services.component.html',
  styleUrls: ['./manage-paid-services.component.css']
})
export class ManagePaidServicesComponent implements OnInit {
  private _paidServices = signal<PaidService[]>([]);
  paidServices = computed(() => {
    const data = this._paidServices();
    return Array.isArray(data) ? data : [];
  });

  private _accommodations = signal<Accommodation[]>([]);
  accommodations = computed(() => {
    const data = this._accommodations();
    return Array.isArray(data) ? data : [];
  });

  loading = signal(false);

  constructor(
    private paidServiceService: PaidServiceService,
    private accommodationService: AccommodationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAccommodations();
    this.loadPaidServices();
  }

  openDialog(service?: PaidService): void {
    import('../paid-service-dialog/paid-service-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.PaidServiceDialogComponent, {
        data: { service: service || null, accommodations: this.accommodations() },
        width: '600px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadPaidServices();
        }
      });
    });
  }

  deleteService(service: PaidService): void {
    if (confirm(`Sei sicuro di voler eliminare "${service.name}"?`)) {
      this.paidServiceService.deletePaidService(service.id).subscribe({
        next: () => {
          this.snackBar.open('Servizio eliminato', 'Chiudi', { duration: 3000 });
          this.loadPaidServices();
        },
        error: () => {
          this.snackBar.open('Errore nell\'eliminazione del servizio', 'Chiudi', { duration: 3000 });
        }
      });
    }
  }

  getAccommodationTitle(accommodationId: number): string {
    const accommodation = this.accommodations().find(a => a.id === accommodationId);
    return accommodation ? accommodation.title : 'N/A';
  }

  private loadAccommodations(): void {
    this.accommodationService.getAccommodations().subscribe({
      next: (data) => {
        this._accommodations.set(Array.isArray(data) ? data : []);
      },
      error: () => {
        this._accommodations.set([]);
        this.snackBar.open('Errore nel caricamento degli alloggi', 'Chiudi', { duration: 3000 });
      }
    });
  }

  private loadPaidServices(): void {
    this.loading.set(true);
    this.paidServiceService.getPaidServices().subscribe({
      next: (data) => {
        this._paidServices.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this._paidServices.set([]);
        this.snackBar.open('Errore nel caricamento dei servizi', 'Chiudi', { duration: 3000 });
      }
    });
  }
}
