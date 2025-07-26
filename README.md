# MMM-SzczecinZDITM

MagicMirror module to display real-time departure information for Szczecin public transport via ZDiTM Szczecin API, with styling.

## Installation
1. Clone into `modules/`:
   ```bash
   git clone https://github.com/yourusername/MMM-SzczecinZDITM.git
   ```
2. `cd MMM-SzczecinZDITM && npm install`
3. Ensure CSS file is present: `MMM-SzczecinZDITM.css`
4. In `config/config.js` add:
```js
{
  module: 'MMM-SzczecinZDITM',
  position: 'top_left',
  config: { stopId: 123, maxDepartures: 5, updateInterval: 60000 }
}
```

## Usage
Wyświetla odjazdy z przystanku i stosuje styl definiowany w `MMM-SzczecinZDITM.css`.