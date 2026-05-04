
Aplikacja typu e-commerce dedykowana sprzedaży herbaty, zbudowana w oparciu o **React**, **Vite** i **TypeScript**. Projekt kładzie duży nacisk na jakość kodu poprzez implementację piramidy testów oraz automatyzację procesów weryfikacji.

## Technologie

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Build Tool:** Vite
- **Testowanie:** Vitest, React Testing Library
- **Routing:** React Router

---

## Strategia Testowa

Projekt realizuje kompleksową strategię testową, łącząc analizę statyczną z dynamicznymi testami na różnych poziomach.

### 1. Poziomy Testów

- **Testy Jednostkowe (Unit Tests):**
  - **Zakres:** Testowanie czystych funkcji pomocniczych (utils) oraz pojedynczych, bezstanowych komponentów UI.
  - **Cel:** Szybka weryfikacja logiki obliczeniowej (np. formatowanie cen, generowanie linków do grafik).
- **Testy Integracyjne:**
  - **Zakres:** Weryfikacja interakcji między kluczowymi modułami, np. komunikacja `Navbar` ↔ `App` ↔ `Mock API`.
  - **Uzasadnienie:** Upewnienie się, że komponenty poprawnie współdzielą stan i reagują na asynchroniczne dane z `fetch`.
- **Testy End-to-End (E2E) - _w planach_:**
  - **Scenariusz:** Kompletna ścieżka zakupowa: Wyszukanie produktu -> Koszyk -> Checkout.
  - **Narzędzie:** Playwright.

### 2. Analiza Statyczna vs Dynamiczna

- **Statyczna:** Wykorzystanie **TypeScript** do kontroli typów oraz **ESLint** do utrzymania standardów czystości kodu (linting) bez uruchamiania aplikacji.
- **Dynamiczna:** Wykorzystanie frameworka **Vitest** do uruchamiania kodu w symulowanym środowisku przeglądarki (JSDOM) i weryfikacji zachowania aplikacji pod wpływem akcji użytkownika.

---

##  Narzędzia Testowe

- **Vitest:** Wybrany ze względu na szybkość i natywną kompatybilność z Vite.
- **React Testing Library:** Pozwala na testowanie komponentów z perspektywy użytkownika (szukanie po `data-testid`, tekstach i rolach), co zwiększa odporność testów na zmiany w implementacji.
- **JSDOM:** Lekka implementacja standardów sieciowych do uruchamiania testów bez pełnej przeglądarki.

---

## Konwencje i Struktura

- **Lokalizacja:** Testy znajdują się w tym samym katalogu co komponenty, z rozszerzeniem `.test.tsx` (np. `src/components/Navbar.test.tsx`).
- **Nazewnictwo:**
  - `describe`: Grupuje testy dla konkretnego komponentu lub funkcjonalności.
  - `it` / `test`: Opisuje konkretne wymaganie (np. _powinien wywołać API po wpisaniu tekstu_).
- **Identyfikatory:** Używamy atrybutów `data-testid` (np. `search-result-item`) jako stabilnych punktów zakotwiczenia dla testów.

---

## Jak uruchomić?

### Instalacja

```bash
npm install

npm run dev

# Uruchomienie testów w trybie watch
npm test

# Uruchomienie graficznego interfejsu testowego (Vitest UI)
npm run test:ui

# Sprawdzenie pokrycia kodu testami (Coverage)
npm run test:coverage
```

---

## Pipeline CI/CD 

W repozytorium został skonfigurowany w pełni zautomatyzowany pipeline **Continuous Integration**, który czuwa nad stabilnością aplikacji przy każdej zmianie w kodzie.

### Charakterystyka Procesu
*   **Wyzwalacze (Triggers):** Pipeline uruchamia się automatycznie przy każdym zdarzeniu `push` oraz `pull_request` na dowolną gałąź projektu.
*   **Środowisko:** Procesy są wykonywane w odizolowanym środowisku `ubuntu-latest` z wykorzystaniem **Node.js 20**.
*   **Optymalizacja:** Wykorzystano mechanizm `cache`, który zapamiętuje zależności npm, znacząco skracając czas trwania kolejnych przebiegów.

### Etapy Pipeline'u (Workflow Steps)
Pipeline został zaprojektowany zgodnie z zasadą **fail-fast** (jeśli wcześniejszy krok zawiedzie, kolejne nie są uruchamiane):

1.  **Checkout:** Pobranie aktualnej wersji kodu do kontenera.
2.  **Setup & Install:** Przygotowanie środowiska i instalacja czystej wersji bibliotek (`npm install`).
3.  **Static Analysis (Quality Gate):**
    *   Uruchomienie skryptu `npm run static-tests`.
    *   Weryfikacja typów (TypeScript), jakości kodu (ESLint) oraz formatowania (Prettier).
4.  **Integration Tests:** Uruchomienie testów dynamicznych przy użyciu **Vitest** (`npm run test:run`).
5.  **Build Check:** Próbna kompilacja wersji produkcyjnej (`npm run build`). Sukces tego etapu gwarantuje, że aplikacja jest gotowa do wdrożenia na serwer.

### Status i Raporty
Status pipeline'u jest widoczny bezpośrednio w zakładce **Actions** na GitHubie. Zielony znacznik (check) przy commitcie jest warunkiem koniecznym do uznania kodu za stabilny i gotowy do połączenia z główną gałęzią.


