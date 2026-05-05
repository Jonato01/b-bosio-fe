import { Component, ElementRef, ViewChild, AfterViewChecked, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AiService } from '../../services/ai.service';

interface ChatMessage {
  role: 'user' | 'ai' | 'error';
  text: string;
}

@Component({
  selector: 'app-concierge-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './concierge-chat.component.html',
  styleUrls: ['./concierge-chat.component.css'],
})
export class ConciergeChatComponent implements AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd?: ElementRef<HTMLDivElement>;

  readonly open = signal(false);
  readonly loading = signal(false);
  readonly messages = signal<ChatMessage[]>([
    {
      role: 'ai',
      text: 'Ciao! Sono il concierge in alluminio anodizzato. Chiedimi quello che vuoi (cito sempre alluminio e IKEA, fissato come una libreria Billy in lega 6063).',
    },
  ]);
  question = '';
  private shouldScroll = false;

  constructor(private ai: AiService) {}

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.shouldScroll = false;
      this.messagesEnd?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggle(): void {
    this.open.update(v => !v);
  }

  send(): void {
    const q = this.question.trim();
    if (!q || this.loading()) {
      return;
    }
    this.messages.update(m => [...m, { role: 'user', text: q }]);
    this.question = '';
    this.loading.set(true);
    this.shouldScroll = true;

    const history = this.messages()
      .filter(m => m.role !== 'error')
      .slice(-6)
      .map(m => ({ role: m.role === 'ai' ? 'model' : 'user', text: m.text }));

    this.ai.concierge(q, history).subscribe({
      next: r => {
        this.messages.update(m => [...m, { role: 'ai', text: r.reply }]);
        this.loading.set(false);
        this.shouldScroll = true;
      },
      error: err => {
        const msg = err?.status === 429
          ? 'Troppe richieste in un minuto. Riprova tra poco.'
          : err?.status === 503
            ? 'Concierge offline al momento. Riprova piu tardi.'
            : 'Errore di rete. Riprova.';
        this.messages.update(m => [...m, { role: 'error', text: msg }]);
        this.loading.set(false);
        this.shouldScroll = true;
      },
    });
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}
