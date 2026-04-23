# AromaBrew - Projekt sklepu z kawą i herbatą

Ten projekt to nowoczesna aplikacja webowa typu Single Page Application (SPA) stworzona przy użyciu React, TypeScript oraz Vite.

## Wymagania wstępne

Zanim rozpoczniesz, upewnij się, że masz zainstalowane na swoim komputerze:
- **Node.js** (zalecana wersja 18.x lub nowsza) - [Pobierz Node.js](https://nodejs.org/)
- **npm** (instaluje się automatycznie razem z Node.js)

## Uruchomienie projektu od zera

Postępuj zgodnie z poniższymi instrukcjami, aby uruchomić projekt na swoim komputerze:

1. **Sklonuj lub pobierz repozytorium**
   Otwórz terminal (lub wiersz poleceń) i przejdź do folderu, w którym chcesz trzymać projekt, a następnie pobierz jego pliki.

2. **Zainstaluj zależności**
   Przejdź do głównego folderu projektu (tam gdzie znajduje się plik `package.json`) i uruchom poniższą komendę w terminalu:
   ```bash
   npm install
   ```
   *Ta komenda pobierze i zainstaluje wszystkie niezbędne biblioteki (m.in. React, Vite, react-router-dom) na podstawie pliku `package.json`.*

3. **Uruchom serwer deweloperski**
   Po zakończeniu instalacji, uruchom aplikację wpisując:
   ```bash
   npm run dev
   ```

4. **Otwórz aplikację w przeglądarce**
   Po wpisaniu powyższej komendy, w terminalu pojawi się adres lokalny (najczęściej `http://localhost:5173`). 
   Skopiuj ten adres i wklej go do przeglądarki internetowej lub kliknij w niego trzymając klawisz `Ctrl` (Windows) / `Cmd` (Mac).

## Struktura projektu

Kluczowe pliki i foldery w projekcie:
- `src/App.tsx` - Główny plik aplikacji zawierający układ strony głównej (Navbar, Hero, Lista produktów itp.).
- `src/pages/Login.tsx` oraz `Login.css` - Strona logowania z zaawansowanymi animacjami SVG (kawa, herbata).
- `src/index.css` - Główne style CSS oraz definicje używanych animacji.
- `index.html` - Główny plik HTML serwowany przez Vite.

## Budowanie wersji produkcyjnej

Jeśli chcesz zbudować zoptymalizowaną wersję aplikacji do wdrożenia na serwer (production build), uruchom:
```bash
npm run build
```
Zbudowane pliki pojawią się w nowo utworzonym folderze `dist`. Możesz je przetestować lokalnie używając komendy:
```bash
npm run preview
```

Powodzenia w kodowaniu! W razie problemów upewnij się, że używasz odpowiedniej wersji Node.js.
