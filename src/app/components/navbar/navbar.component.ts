import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar>
      <span class="logo" routerLink="/">
        <mat-icon>home_work</mat-icon>
        B&Bosio
      </span>

      <span class="spacer"></span>

      <button mat-icon-button class="mobile-menu-btn" [matMenuTriggerFor]="mobileMenu">
        <mat-icon>menu</mat-icon>
      </button>

      <mat-menu #mobileMenu="matMenu">
        @if (authService.isAuthenticated()) {
          <button mat-menu-item routerLink="/bookings/new">
            <mat-icon>add_circle</mat-icon>
            Nuova Prenotazione
          </button>
          <button mat-menu-item routerLink="/my-bookings">
            <mat-icon>event_note</mat-icon>
            Le Mie Prenotazioni
          </button>
          @if (authService.isAdmin()) {
            <button mat-menu-item routerLink="/admin">
              <mat-icon>admin_panel_settings</mat-icon>
              Admin
            </button>
          }
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        } @else {
          <button mat-menu-item routerLink="/login">
            <mat-icon>login</mat-icon>
            Accedi
          </button>
          <button mat-menu-item routerLink="/register">
            <mat-icon>person_add</mat-icon>
            Registrati
          </button>
        }
      </mat-menu>

      @if (authService.isAuthenticated()) {
        <span class="nav-links">
          <button mat-button routerLink="/bookings/new">
            <mat-icon>add_circle</mat-icon>
            Nuova Prenotazione
          </button>
          <button mat-button routerLink="/my-bookings">
            <mat-icon>event_note</mat-icon>
            Le Mie Prenotazioni
          </button>

          @if (authService.isAdmin()) {
            <button mat-button routerLink="/admin">
              <mat-icon>admin_panel_settings</mat-icon>
              Admin
            </button>
          }

          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <div class="user-info">
              <strong>{{ authService.currentUser()?.display_name }}</strong>
              <span>{{ authService.currentUser()?.email }}</span>
            </div>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
          </mat-menu>
        </span>
      } @else {
        <span class="nav-links">
          <button mat-button routerLink="/login">
            <mat-icon>login</mat-icon>
            Accedi
          </button>
          <button mat-raised-button routerLink="/register">
            <mat-icon>person_add</mat-icon>
            Registrati
          </button>
        </span>
      }
    </mat-toolbar>
  `,
  styles: [`
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 24px;
      font-weight: 600;
      cursor: pointer;
      user-select: none;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .mobile-menu-btn {
      display: none;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      padding: 8px 16px;
      border-bottom: 1px solid var(--border-color);
    }

    .user-info strong {
      font-size: 14px;
      margin-bottom: 4px;
    }

    .user-info span {
      font-size: 12px;
      color: var(--text-secondary);
    }

    button mat-icon {
      margin-right: 4px;
    }

    @media (max-width: 768px) {
      .mobile-menu-btn { display: inline-flex; }
      .nav-links { display: none; }
    }
  `]
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
  }
}

