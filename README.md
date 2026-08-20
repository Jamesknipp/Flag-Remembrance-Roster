# Flag Remembrance Roster

A fully local roster app for tracking aviators, their unit assignments, service status, and dedication links. The app stores data in the browser with encrypted localStorage, generates QR codes for dedication URLs, and supports import/export for roster backups.

## Features

- Add aviators with name, unit, component, status, notes, and dedication URL
- Save roster data locally in the browser with a passcode gate
- Encrypt roster data in localStorage using the browser Web Crypto API
- Generate QR codes for each aviator's dedication URL
- Filter the roster by name, status, and component
- Show live stats for total, KIA, living, active, guard, and reserve counts
- Export the roster to JSON
- Import a roster from JSON
- Run entirely client-side with no backend

## Run locally

Because this is a static app, you can launch it directly in a browser or serve it with a local web server.

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2: Use a local web server

From the project folder:

```bash
cd "C:\Users\james\OneDrive\Documents\GitHub\Flag-Remembrance-Roster"
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
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
├── index.html
├── assets/
├── scripts/
├── README.md
├── .gitignore
├── timezone-clock.html
└── .git
```
