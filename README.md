# MMM-SzczecinZDITM (No CORS)

MagicMirror module to display real-time departure information for Szczecin public transport via ZDiTM Szczecin API (manual stop config only).

## Installation
```bash
cd ~/MagicMirror/modules
unzip MMM-SzczecinZDITM_nocors.zip
cd MMM-SzczecinZDITM
npm install
```

## Configuration
In `config/config.js`:

```js
{
  module: 'MMM-SzczecinZDITM',
  position: 'top_left',
  config: {
    maxDepartures: 5,
    updateInterval: 60000,
    stops: [
      { id: 50,  name: 'Plac Żołnierza Polskiego', line: 3 },
      { id: 120, name: 'Plac Grunwaldzki' }
    ]
  }
}
```

## Notes
- Uses only `/api/v1/departures`
- No `/stops` request (manual configuration only)
- Safe for use without CORS errors
