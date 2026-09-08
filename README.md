# Flag Remembrance Roster

This repository holds two standalone, browser-only apps:

- **`index.html`** - the Flag Remembrance Roster, for tracking aviators and dedication flags.
- **`qr-tracker.html`** - a QR asset tracker for retail stock, equipment, and tools.

## Flag Remembrance Roster (`index.html`)

A fully local roster app for tracking aviators, their unit assignments, service status, and dedication links. The app stores data in the browser with encrypted localStorage, generates QR codes for dedication URLs, and supports import/export for roster backups.

### Features

- Add aviators with name, unit, component, status, notes, and dedication URL
- Save roster data locally in the browser with a passcode gate
- Encrypt roster data in localStorage using the browser Web Crypto API
- Generate QR codes for each aviator's dedication URL
- Filter the roster by name, status, and component
- Show live stats for total, KIA, living, active, guard, and reserve counts
- Export the roster to JSON
- Import a roster from JSON
- Run entirely client-side with no backend

## QR Asset Tracker (`qr-tracker.html`)

Tag any physical item with a QR code and track where it is, who has it, and what has happened to it. Built for retail stock, shop equipment, and tools.

### Features

- Register items with an auto-generated asset ID, category, SKU, serial, location, assignee, quantity, cost, vendor, and dates
- Generate a unique QR code per item, shown in the table and full size on the item detail view
- Scan tags with the device camera (uses the browser `BarcodeDetector` when available, and jsQR otherwise), or type an asset ID by hand
- Check items out and back in, move them, send them to maintenance, retire them, or mark them lost - every action is timestamped in the item's history
- Filter and search by name, asset ID, SKU, serial, location, person, category, and status
- Live totals for available, checked out, in maintenance, lost/retired, and inventory value
- Print a sheet of QR labels for the current filter, or a single label, and download any QR code as a high-resolution PNG
- Export to JSON or CSV, and import JSON back (matching asset IDs are updated, new ones are added)
- Point QR codes at a hosted copy of the app so a phone camera opens the item page directly
- Runs entirely client-side with no backend, and works offline - the QR libraries are vendored in `assets/vendor/`

### Deep links

When a base URL is set in Settings, each QR code encodes `BASE#item=ASSET-ID`. Opening that link loads the tracker and jumps straight to the item. With no base URL set, the QR code contains the bare asset ID, which is the better choice for scanning with a handheld barcode reader.

### Data and privacy

Items live in this browser's `localStorage` under `qr-asset-tracker-v1`. Data is not encrypted and does not leave the machine, so use the JSON export for backups and treat a shared computer accordingly.

## Run locally

Because these are static apps, you can launch them directly in a browser or serve them with a local web server.

### Option 1: Open directly

Open `index.html` (roster) or `qr-tracker.html` (asset tracker) in your browser.

Camera scanning needs a secure context, so serve the tracker over `http://localhost` or HTTPS rather than opening the file directly if you want to scan with a webcam or phone.

### Option 2: Use a local web server

From the project folder:

```bash
cd "C:\Users\james\OneDrive\Documents\GitHub\Flag-Remembrance-Roster"
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/index.html
http://localhost:8000/qr-tracker.html
```

If your machine uses `python3` instead, use:

```bash
python3 -m http.server 8000
```

## Security notes

This app uses encrypted localStorage to protect roster data and displays a password gate before loading the roster. The app remains local-only and does not send data to a server.

## Deployment later

This project can be deployed as a static site on services such as:

- GitHub Pages
- Netlify
- Cloudflare Pages
- Vercel static hosting

## Project structure

```text
Flag-Remembrance-Roster/
├── index.html            # Flag Remembrance Roster
├── qr-tracker.html       # QR Asset Tracker
├── timezone-clock.html
├── assets/
│   └── vendor/           # qrcode-generator and jsQR, vendored for offline use
├── scripts/
├── README.md
├── .gitignore
└── .git
```

## Third-party libraries

- [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (MIT) - QR code rendering
- [jsQR](https://github.com/cozmo/jsQR) (Apache-2.0) - QR decoding fallback for browsers without `BarcodeDetector`
