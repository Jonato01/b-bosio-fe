import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PhotoService } from '../../services/photo.service';
import { AccommodationService } from '../../services/accommodation.service';
import { Photo } from '../../models/photo.model';
import { Accommodation } from '../../models/accommodation.model';

@Component({
  selector: 'app-manage-photos',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './manage-photos.component.html',
  styleUrls: ['./manage-photos.component.css']
})
export class ManagePhotosComponent implements OnInit {
  private _photos = signal<Photo[]>([]);
  photos = computed(() => {
    const data = this._photos();
    return Array.isArray(data) ? data : [];
  });

  private _accommodations = signal<Accommodation[]>([]);
  accommodations = computed(() => {
    const data = this._accommodations();
    return Array.isArray(data) ? data : [];
  });

  loading = signal(false);
  selectedAccommodation = signal<number | null>(null);

  constructor(
    private photoService: PhotoService,
    private accommodationService: AccommodationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAccommodations();
    this.loadPhotos();
  }

  openUploadDialog(): void {
    import('../photo-upload-dialog/photo-upload-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.PhotoUploadDialogComponent, {
        data: { accommodations: this.accommodations() },
        width: '600px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadPhotos();
        }
      });
    });
  }

  onAccommodationChange(id: number | null): void {
    this.selectedAccommodation.set(id);
    this.loadPhotos();
  }

  deletePhoto(photo: Photo): void {
    if (confirm('Sei sicuro di voler eliminare questa foto?')) {
      this.photoService.deletePhoto(photo.id).subscribe({
        next: () => {
          this.snackBar.open('Foto eliminata', 'Chiudi', { duration: 3000 });
          this.loadPhotos();
        },
        error: () => {
          this.snackBar.open('Errore nell\'eliminazione della foto', 'Chiudi', { duration: 3000 });
        }
      });
    }
  }

  loadAccommodations(): void {
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

  loadPhotos(): void {
    this.loading.set(true);
    this.photoService.getPhotos(this.selectedAccommodation()).subscribe({
      next: (data) => {
        this._photos.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: () => {
        this._photos.set([]);
        this.loading.set(false);
        this.snackBar.open('Errore nel caricamento delle foto', 'Chiudi', { duration: 3000 });
      }
    });
  }
}
