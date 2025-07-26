# MMM-SzczecinZDITM (Displays API)

MagicMirror module to display real-time departure info from Szczecin ZDiTM using departure boards endpoint.

## Installation
```bash
cd ~/MagicMirror/modules
unzip MMM-SzczecinZDITM_displays.zip
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
      { number: '11312', name: 'Plac Żołnierza Polskiego', line: 3 }
    ]
  }
}
```

## Notes
- Uses `https://www.zditm.szczecin.pl/api/v1/displays/{stopNumber}`
- Filters by `line` if provided
