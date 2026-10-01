# TestLab — Modern Web Testing Sandbox by Mustafa LLC

A lightweight, modern, and zero-dependency website designed for web development, UI verification, network tests, responsive checks, and event inspection.

## Features
- **Client Environment & Viewport**: Real-time viewport dimensions ($W \times H$), DPR, network status, user agent, language, and screen resolution.
- **Interactive Events**: Click counter, double-click trigger, and keypress logger.
- **Form Controls Live Sync**: Text input, select dropdown, slider, and toggle switch with instant JSON serialization preview.
- **Network & API Tester**: Interactive HTTP GET request tool measuring latency in ms, status codes, and JSON response formatting.
- **LocalStorage Tester**: Save, inspect, delete, and clear local storage keys.
- **UI Feedback & Web Audio API**: Toast notifications, accessible modal dialogs with Escape listener, and Web Audio API synthesizer tone generator.
- **Customizable Logo**: Interactive logo switcher (Cyber Hexagon, Mustafa "M" Monogram, Science Lab Flask).
- **Dark/Light Mode**: Smooth theme toggling with localStorage persistence.

## How to Run Locally

### Option 1: Double-Click Launcher
Double-click `start.bat` in Windows. It starts the local HTTP server and opens your browser to `http://localhost:8080/`.

### Option 2: PowerShell
Run the included PowerShell server script:
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

### Option 3: Direct File
Simply open `index.html` in any web browser.
