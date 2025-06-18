# Quick Commands - Projekt Flowbite React

## 🚀 Podstawowe Komendy

### Development
```bash
# Uruchom serwer deweloperski
npm run dev

# Build produkcyjny
npm run build

# Preview buildu
npm run preview
```

### Quality Assurance
```bash
# TypeScript check
npm run typecheck

# ESLint check
npm run lint

# Prettier format
npm run format
```

## 📦 Zarządzanie Zależnościami

### Sprawdzanie Aktualizacji
```bash
# Sprawdź outdated packages
npm outdated

# Sprawdź security vulnerabilities
npm audit

# Fix security issues
npm audit fix
```

### Aktualizacje
```bash
# Bezpieczne aktualizacje (patch/minor)
npm update

# Aktualizacja konkretnego pakietu
npm install package@latest

# Aktualizacja Flowbite
npm install flowbite@latest flowbite-react@latest
```

## 🔧 Debugging

### Logi i Diagnostyka
```bash
# Sprawdź wersje pakietów
npm list --depth=0

# Sprawdź konfigurację npm
npm config list

# Wyczyść cache npm
npm cache clean --force
```

### Problemy z Buildem
```bash
# Wyczyść node_modules i reinstaluj
rm -rf node_modules package-lock.json
npm install

# Sprawdź TypeScript errors
npx tsc --noEmit

# Sprawdź ESLint errors
npx eslint . --ext .ts,.tsx
```

## 🎨 Flowbite React

### Komponenty
```bash
# Sprawdź dostępne komponenty Flowbite
npm info flowbite-react

# Dokumentacja online
open https://flowbite-react.com/docs
```

### Theming
```typescript
// Import theme provider
import { ThemeProvider } from "flowbite-react";

// Custom theme
import customTheme from "./flowbite-theme";
```

## 🏗️ Struktura Projektu

### Główne Katalogi
```
src/
├── components/     # Komponenty React
├── pages/         # Strony aplikacji
├── layouts/       # Layout komponenty
├── api/          # API calls
├── context/      # React Context
└── data/         # Statyczne dane
```

### Backend
```
backend/
├── src/          # Kod źródłowy
├── dist/         # Skompilowany kod
└── database/     # Migracje i seedy
```

## 🚨 Troubleshooting

### Częste Problemy

#### 1. TypeScript Errors
```bash
# Sprawdź konfigurację
cat tsconfig.json

# Restart TypeScript server (VS Code)
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

#### 2. ESLint Errors
```bash
# Fix auto-fixable issues
npm run lint -- --fix

# Ignore specific rules
// eslint-disable-next-line @typescript-eslint/no-explicit-any
```

#### 3. Flowbite Issues
```bash
# Sprawdź wersję
npm list flowbite-react

# Reinstaluj Flowbite
npm uninstall flowbite flowbite-react
npm install flowbite@latest flowbite-react@latest
```

#### 4. Vite Issues
```bash
# Wyczyść cache Vite
rm -rf .vite

# Restart dev server
npm run dev
```

## 📱 Mobile Development

### Responsive Testing
```bash
# Uruchom z dostępem z sieci lokalnej
npm run dev -- --host

# Sprawdź na urządzeniu mobilnym
# http://[your-ip]:5173
```

## 🔐 Environment Variables

### Development
```bash
# Utwórz .env.local
echo "VITE_API_URL=http://localhost:3000" > .env.local

# Sprawdź zmienne
echo $VITE_API_URL
```

### Production
```bash
# Build z production env
NODE_ENV=production npm run build
```

## 📊 Performance

### Bundle Analysis
```bash
# Analiza bundle size
npm run build -- --analyze

# Sprawdź performance
npm run preview
# Otwórz DevTools → Lighthouse
```

### Monitoring
```bash
# Sprawdź memory usage
node --inspect npm run dev

# Profile aplikacji
# Chrome DevTools → Performance tab
```

## 🎯 Git Workflow

### Podstawowe Komendy
```bash
# Status
git status

# Add changes
git add .

# Commit
git commit -m "feat: add new component"

# Push
git push origin develop
```

### Branching
```bash
# Nowy branch
git checkout -b feature/new-feature

# Merge do develop
git checkout develop
git merge feature/new-feature
```

## 🚀 Deployment

### Build Check
```bash
# Test build lokalnie
npm run build
npm run preview

# Sprawdź size
du -sh dist/
```

### Production Deploy
```bash
# Build production
NODE_ENV=production npm run build

# Upload dist/ folder to server
```

## 📚 Dokumentacja

### Linki
- [Flowbite React Docs](https://flowbite-react.com/docs)
- [Vite Docs](https://vitejs.dev/)
- [React Router Docs](https://reactrouter.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

### Lokalne Pliki
- `PRZEWODNIK_AKTUALIZACJI_FLOWBITE_REACT.md`
- `ANALIZA_VITE_VS_NEXTJS.md`
- `README.md` 