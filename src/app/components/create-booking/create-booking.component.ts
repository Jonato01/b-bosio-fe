import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { AccommodationService } from '../../services/accommodation.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Accommodation } from '../../models/accommodation.model';
import { CreateBookingRequest } from '../../models/booking.model';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css']
})
export class CreateBookingComponent implements OnInit {
  bookingForm: FormGroup;
  accommodations = signal<Accommodation[]>([]);
  loading = signal(false);
  checkingAvailability = signal(false);
  availabilityChecked = signal(false);
  isAvailable = signal(false);
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private accommodationService: AccommodationService,
    private bookingService: BookingService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      accommodation: ['', Validators.required],
      check_in_date: ['', Validators.required],
      check_in_time: ['14:00', Validators.required],
      check_out_date: ['', Validators.required],
      check_out_time: ['10:00', Validators.required],
      num_guests: [1, [Validators.required, Validators.min(1)]],
      notes: [''],
      guests_data: this.fb.array([])
    });

    // Watch num_guests changes to update guests array
    this.bookingForm.get('num_guests')?.valueChanges.subscribe(value => {
      this.updateGuestsArray(value);
    });
  }

  ngOnInit(): void {
    this.loadAccommodations();
    this.updateGuestsArray(1);
  }

  get guests(): FormArray {
    return this.bookingForm.get('guests_data') as FormArray;
  }

  private updateGuestsArray(count: number): void {
    const guestsArray = this.guests;

    while (guestsArray.length < count) {
      guestsArray.push(this.createGuestFormGroup());
    }

    while (guestsArray.length > count) {
      guestsArray.removeAt(guestsArray.length - 1);
    }
  }

  private createGuestFormGroup(): FormGroup {
    return this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      birth_date: [''],
      document_type: [''],
      document_number: [''],
      notes: ['']
    });
  }

  private loadAccommodations(): void {
    this.accommodationService.getAccommodations().subscribe({
      next: (data) => this.accommodations.set(data),
      error: () => this.snackBar.open('Errore nel caricamento degli alloggi', 'Chiudi', { duration: 3000 })
    });
  }

  checkAvailability(): void {
    const accommodationId = this.bookingForm.get('accommodation')?.value;
    const checkInDate = this.bookingForm.get('check_in_date')?.value;
    const checkInTime = this.bookingForm.get('check_in_time')?.value;
    const checkOutDate = this.bookingForm.get('check_out_date')?.value;
    const checkOutTime = this.bookingForm.get('check_out_time')?.value;

    if (!accommodationId || !checkInDate || !checkOutDate) {
      this.snackBar.open('Compila tutti i campi obbligatori', 'Chiudi', { duration: 3000 });
      return;
    }

    const accommodation = this.accommodations().find(a => a.id === accommodationId);
    if (!accommodation) return;

    const checkIn = this.formatDateTime(checkInDate, checkInTime);
    const checkOut = this.formatDateTime(checkOutDate, checkOutTime);

    this.checkingAvailability.set(true);

    this.accommodationService.checkAvailability(accommodation.slug, checkIn, checkOut).subscribe({
      next: (result) => {
        this.checkingAvailability.set(false);
        this.availabilityChecked.set(true);
        this.isAvailable.set(result.available);

        if (result.available) {
          this.snackBar.open('✓ Alloggio disponibile!', 'Chiudi', { duration: 3000 });
        } else {
          this.snackBar.open('✗ Alloggio non disponibile per le date selezionate', 'Chiudi', { duration: 5000 });
        }
      },
      error: () => {
        this.checkingAvailability.set(false);
        this.snackBar.open('Errore nella verifica disponibilità', 'Chiudi', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.valid && !this.loading() && this.isAvailable()) {
      this.loading.set(true);

      const formValue = this.bookingForm.value;
      const checkIn = this.formatDateTime(formValue.check_in_date, formValue.check_in_time);
      const checkOut = this.formatDateTime(formValue.check_out_date, formValue.check_out_time);

      // Get current user
      const currentUser = this.authService.currentUser();

      // Validate user is authenticated
      if (!currentUser || !currentUser.id) {
        this.loading.set(false);
        this.snackBar.open('Devi essere autenticato per creare una prenotazione', 'Chiudi', { duration: 3000 });
        this.router.navigate(['/login']);
        return;
      }

      // Clean guests_data by removing empty optional fields
      const cleanedGuestsData = formValue.guests_data.map((guest: any) => {
        const cleaned: any = {
          full_name: guest.full_name,
          email: guest.email,
          phone: guest.phone
        };

        // Only add optional fields if they have values
        if (guest.birth_date) cleaned.birth_date = guest.birth_date;
        if (guest.document_type) cleaned.document_type = guest.document_type;
        if (guest.document_number) cleaned.document_number = guest.document_number;
        if (guest.notes) cleaned.notes = guest.notes;

        return cleaned;
      });

      const bookingData: CreateBookingRequest = {
        accommodation: formValue.accommodation,
        user: currentUser.id, // Add user field from authenticated user
        check_in: checkIn,
        check_out: checkOut,
        num_guests: formValue.num_guests,
        notes: formValue.notes || undefined,
        guests_data: cleanedGuestsData.length > 0 ? cleanedGuestsData : []
      };

      console.log('Sending booking data:', bookingData);

      this.bookingService.createBooking(bookingData).subscribe({
        next: () => {
          this.loading.set(false);
          this.snackBar.open('Prenotazione creata con successo!', 'Chiudi', { duration: 3000 });
          this.bookingForm.reset();
          this.availabilityChecked.set(false);
          this.isAvailable.set(false);
          this.updateGuestsArray(1); // Reset to 1 guest
        },
        error: (error) => {
          this.loading.set(false);
          console.error('Booking error:', error);

          // Handle specific field errors
          let message = 'Errore nella creazione della prenotazione';
          if (error.error) {
            if (error.error.detail) {
              message = error.error.detail;
            } else if (error.error.guests_data) {
              message = 'Errore nei dati degli ospiti: ' + JSON.stringify(error.error.guests_data);
            } else if (typeof error.error === 'string') {
              message = error.error;
            }
          }
          this.snackBar.open(message, 'Chiudi', { duration: 5000 });
        }
      });
    } else if (!this.isAvailable()) {
      this.snackBar.open('Verifica prima la disponibilità', 'Chiudi', { duration: 3000 });
    }
  }

  private formatDateTime(date: Date, time: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T${time}:00Z`;
  }
}

