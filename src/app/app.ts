import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ConciergeChatComponent } from './components/concierge-chat/concierge-chat.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ConciergeChatComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bnbosio');
}
