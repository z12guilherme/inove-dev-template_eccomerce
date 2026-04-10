/**
 * Testes do ThemeProvider
 * Cobre: valores padrão, aplicação de tema, leitura e persistência no localStorage
 */
import { defaultTheme, applyTheme, getStoredTheme, saveTheme } from '../lib/themeProvider';

// Mock do localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] ?? null,
        setItem: (key, value) => { store[key] = String(value); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock do document.documentElement.style
const setPropertyMock = jest.fn();
Object.defineProperty(document, 'documentElement', {
    value: { style: { setProperty: setPropertyMock } },
    writable: true,
});

// Mock do window.dispatchEvent
window.dispatchEvent = jest.fn();

beforeEach(() => {
    localStorage.clear();
    setPropertyMock.mockClear();
});

describe('ThemeProvider — defaultTheme', () => {
    it('contém todas as chaves de cor necessárias', () => {
        expect(defaultTheme).toHaveProperty('primary');
        expect(defaultTheme).toHaveProperty('primaryLight');
        expect(defaultTheme).toHaveProperty('primaryMid');
        expect(defaultTheme).toHaveProperty('primaryDark');
        expect(defaultTheme).toHaveProperty('accent');
    });

    it('padrão é a paleta verde', () => {
        expect(defaultTheme.primary).toBe('#16a34a');
    });
});

describe('ThemeProvider — applyTheme', () => {
    it('define todas as 5 CSS custom properties', () => {
        applyTheme(defaultTheme);
        expect(setPropertyMock).toHaveBeenCalledTimes(5);
        expect(setPropertyMock).toHaveBeenCalledWith('--brand-primary', defaultTheme.primary);
        expect(setPropertyMock).toHaveBeenCalledWith('--brand-primary-light', defaultTheme.primaryLight);
        expect(setPropertyMock).toHaveBeenCalledWith('--brand-primary-mid', defaultTheme.primaryMid);
        expect(setPropertyMock).toHaveBeenCalledWith('--brand-primary-dark', defaultTheme.primaryDark);
        expect(setPropertyMock).toHaveBeenCalledWith('--brand-accent', defaultTheme.accent);
    });
});

describe('ThemeProvider — getStoredTheme', () => {
    it('retorna o defaultTheme quando não há nada salvo', () => {
        const theme = getStoredTheme();
        expect(theme).toEqual(defaultTheme);
    });

    it('retorna tema mesclado com defaultTheme quando há dados parciais', () => {
        localStorage.setItem('inove_theme', JSON.stringify({ primary: '#7c3aed' }));
        const theme = getStoredTheme();
        expect(theme.primary).toBe('#7c3aed');
        // Demais chaves vêm do defaultTheme
        expect(theme.accent).toBe(defaultTheme.accent);
    });

    it('retorna defaultTheme em caso de JSON inválido', () => {
        localStorage.setItem('inove_theme', 'isso_nao_e_json');
        const theme = getStoredTheme();
        expect(theme).toEqual(defaultTheme);
    });
});

describe('ThemeProvider — saveTheme', () => {
    it('persiste o tema no localStorage', () => {
        const customTheme = { ...defaultTheme, primary: '#2563eb' };
        saveTheme(customTheme);
        const raw = localStorage.getItem('inove_theme');
        expect(JSON.parse(raw).primary).toBe('#2563eb');
    });

    it('chama applyTheme ao salvar (atualiza CSS variables)', () => {
        saveTheme(defaultTheme);
        expect(setPropertyMock).toHaveBeenCalledWith('--brand-primary', defaultTheme.primary);
    });

    it('dispara evento storage para sincronizar outras abas', () => {
        saveTheme(defaultTheme);
        expect(window.dispatchEvent).toHaveBeenCalled();
    });
});
