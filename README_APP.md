# B&Bosio - Sistema di Prenotazione Alloggi

Sistema di prenotazione di alloggi realizzato con **Angular 20** e **Angular Material**.

## 🚀 Caratteristiche

- ✅ **Autenticazione JWT** - Login e registrazione con token sicuri
- 👤 **Gestione Utenti** - Account utente e amministratore
- 📅 **Prenotazioni** - Sistema completo di prenotazione con check-in e check-out personalizzabili
- 🔒 **Periodi Bloccati** - Possibilità di bloccare periodi e giorni specifici
- 👥 **Gestione Ospiti** - Registrazione dettagli per ogni ospite
- 📱 **Responsive Design** - Ottimizzato per desktop e mobile
- 🎨 **Material Design** - Interfaccia moderna e professionale

## 📋 Prerequisiti

- Node.js (versione 18 o superiore)
- npm (versione 9 o superiore)
- Backend API Django in esecuzione su `http://localhost:8000`

## 🛠️ Installazione

1. Clona il repository:
```bash
git clone <repository-url>
cd bnbosio
```

2. Installa le dipendenze:
```bash
npm install
```

3. Avvia il server di sviluppo:
```bash
npm start
```

4. Apri il browser su `http://localhost:4200`

## 🏗️ Struttura del Progetto

```
src/app/
├── components/              # Componenti Angular
│   ├── home/               # Pagina home
│   ├── login/              # Form di login
│   ├── register/           # Form di registrazione
│   ├── create-booking/     # Creazione prenotazione
│   ├── my-bookings/        # Le mie prenotazioni
│   ├── admin-dashboard/    # Dashboard amministratore
│   ├── blocked-period-dialog/  # Dialog periodi bloccati
│   └── navbar/             # Barra di navigazione
├── guards/                 # Route guards
│   └── auth.guard.ts       # Guard per autenticazione e ruoli
├── interceptors/           # HTTP interceptors
│   └── auth.interceptor.ts # Interceptor per JWT
├── models/                 # Modelli TypeScript
│   ├── user.model.ts
│   ├── accommodation.model.ts
│   ├── booking.model.ts
│   └── blocked-period.model.ts
├── services/               # Servizi Angular
│   ├── auth.service.ts
│   ├── accommodation.service.ts
│   ├── booking.service.ts
│   └── blocked-period.service.ts
├── app.config.ts           # Configurazione app
├── app.routes.ts           # Routing
├── app.ts                  # Componente root
└── app.html                # Template root
```

## 🔑 Funzionalità Principali

### Utente Standard

1. **Registrazione e Login**
   - Registrazione con email e password
   - Login sicuro con JWT
   - Validazione form completa

2. **Prenotazioni**
   - Visualizza alloggi disponibili
   - Verifica disponibilità per date specifiche
   - Crea prenotazioni con dettagli ospiti
   - Visualizza e gestisci le proprie prenotazioni
   - Annulla prenotazioni

### Amministratore

1. **Dashboard Admin**
   - Visualizza tutte le prenotazioni
   - Conferma/rifiuta prenotazioni in sospeso
   - Gestisci periodi bloccati
   - Gestisci giorni della settimana bloccati

2. **Gestione Disponibilità**
   - Aggiungi periodi bloccati (es. manutenzione)
   - Blocca giorni specifici della settimana
   - Elimina periodi bloccati

## 🎯 Endpoints API Utilizzati

L'applicazione si connette alle seguenti API del backend Django:

- `POST /api/auth/login/` - Login
- `POST /api/auth/refresh/` - Refresh token
- `POST /api/users/` - Registrazione
- `GET /api/users/me/` - Profilo utente
- `GET /api/accommodations/` - Lista alloggi
- `GET /api/accommodations/{slug}/availability/` - Verifica disponibilità
- `POST /api/bookings/` - Crea prenotazione
- `GET /api/users/my_bookings/` - Le mie prenotazioni
- `POST /api/bookings/{id}/cancel/` - Annulla prenotazione
- `POST /api/bookings/{id}/confirm/` - Conferma prenotazione (admin)
- `POST /api/bookings/{id}/reject/` - Rifiuta prenotazione (admin)
- `GET /api/blocked-periods/` - Lista periodi bloccati
- `POST /api/blocked-periods/` - Aggiungi periodo bloccato
- `DELETE /api/blocked-periods/{id}/` - Elimina periodo bloccato

## 🎨 Temi e Personalizzazione

L'applicazione utilizza il tema Material **Indigo-Pink**. Per cambiare tema, modifica l'import in `src/styles.css`:

```css
@import '@angular/material/prebuilt-themes/deeppurple-amber.css';
/* oppure */
@import '@angular/material/prebuilt-themes/pink-bluegrey.css';
/* oppure */
@import '@angular/material/prebuilt-themes/purple-green.css';
```

## 🔧 Configurazione

Per cambiare l'URL del backend API, modifica la proprietà `API_URL` nei servizi:

```typescript
// src/app/services/*.service.ts
private readonly API_URL = 'http://localhost:8000/api';
```

## 📱 Build per Produzione

```bash
npm run build
```

I file di build saranno generati nella cartella `dist/`.

## 🧪 Test

```bash
npm test
```

## 📝 Note Importanti

1. **Sicurezza**: Assicurati che il backend sia configurato correttamente con CORS per accettare richieste dal frontend
2. **Token**: I token JWT sono salvati in localStorage. Per maggiore sicurezza, considera l'uso di httpOnly cookies
3. **Date**: Le date sono in formato ISO 8601 (UTC)
4. **Ruoli**: Gli amministratori devono essere configurati nel backend con role_name='admin' o 'manager'

## 🐛 Troubleshooting

### Errore CORS
Se ricevi errori CORS, verifica che il backend Django abbia configurato correttamente `django-cors-headers`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
]
```

### Token Scaduto
Se ricevi errori 401, il token potrebbe essere scaduto. L'applicazione tenta automaticamente il refresh, ma potrebbe essere necessario rifare il login.

### Errori di Connessione
Verifica che il backend sia in esecuzione su `http://localhost:8000`

## 📄 Licenza

Proprietario: B&Bosio

## 👥 Supporto

Per supporto e domande, contatta il team di sviluppo.

