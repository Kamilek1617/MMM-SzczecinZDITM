# MMM-SzczecinZDITM

MagicMirror module to display real-time departure information for Szczecin public transport via ZDiTM Szczecin API.

## Installation
1. Clone this repository into your MagicMirror modules folder:
   ```bash
   git clone https://github.com/yourusername/MMM-SzczecinZDITM.git
   ```
2. Navigate to the module folder and install dependencies:
   ```bash
   cd MMM-SzczecinZDITM
   npm install
   ```
3. Add configuration to `config/config.js`:
   ```js
   {
     module: 'MMM-SzczecinZDITM',
     position: 'top_left',
     config: {
       stopId: 123,          // Replace with your stop ID or leave blank to auto-select first
       maxDepartures: 5,     // Number of departures to show
       updateInterval: 60000 // Refresh interval in ms
     }
   }
   ```

## Usage
Module pobiera listę przystanków (jeśli `stopId` nie jest ustawiony) i co określony interwał odświeża tabelę z odjazdami.

## Konfiguracja
- `stopId`: ID przystanku do monitorowania
- `maxDepartures`: maksymalna liczba wyświetlanych odjazdów
- `updateInterval`: interwał odświeżania w milisekundach
