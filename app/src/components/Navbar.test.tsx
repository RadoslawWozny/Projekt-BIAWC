// @vitest-environment jsdom
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { BrowserRouter } from "react-router";
import "@testing-library/jest-dom";
import App from "../App";

window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Rejestrujemy globalny mock dla fetch
vi.stubGlobal("fetch", vi.fn());

describe("Navbar Search Functionality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Automatyczne czyszczenie po każdym teście, aby uniknąć wycieków (image_0daab8.png)
  afterEach(() => {
    cleanup();
  });

  it("powinien wywołać API i wyświetlić wyniki po wpisaniu tekstu", async () => {
    const mockProduct = {
      id: 1,
      nazwa: "Sencha Premium",
      cena: 29.99,
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [mockProduct],
    });
    vi.stubGlobal("fetch", fetchMock);

    // Renderujemy całe App, aby działał stan i useEffect
    const { unmount } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    // 1. Otwieramy wyszukiwarkę
    const toggleBtn = screen.getByTestId("search-toggle-btn");
    fireEvent.click(toggleBtn);

    // 2. Wpisujemy tekst
    const input = await screen.findByTestId("search-input-field");
    fireEvent.change(input, { target: { value: "sencha premium" } });

    // 3. Czekamy na wywołanie fetch
    await waitFor(
      () => {
        expect(fetchMock).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );

    // 4. Sprawdzamy czy wynik się pojawił
    const result = await screen.findByTestId(
      "search-result-item",
      {},
      { timeout: 5000 },
    );
    expect(result).toHaveTextContent(/Sencha/i);

    // 5. Ręczne odmontowanie na końcu, aby uciszyć błędy w terminalu
    unmount();
  });

  it("powinien wyczyścić wyszukiwanie po kliknięciu w przycisk zamknięcia", async () => {
    const { unmount } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    const toggleBtn = screen.getByTestId("search-toggle-btn");
    fireEvent.click(toggleBtn);

    const input = await screen.findByTestId("search-input-field");
    fireEvent.change(input, { target: { value: "test" } });

    // Ponowne kliknięcie lupy (zamknięcie)
    fireEvent.click(toggleBtn);

    // Sprawdzamy czy wyniki zniknęły
    await waitFor(() => {
      const results = screen.queryByTestId("search-result-item");
      expect(results).not.toBeInTheDocument();
    });

    unmount();
  });
});
