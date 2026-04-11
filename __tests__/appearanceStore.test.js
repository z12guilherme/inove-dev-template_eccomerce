import { defaultAppearance, getAppearance, applyFont, saveAppearance } from '../lib/appearanceStore';
import * as themeProvider from '../lib/themeProvider';
import { vi } from 'vitest';

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

// Mock themeProvider saveTheme
vi.mock('../lib/themeProvider', () => ({
    saveTheme: vi.fn(),
    applyTheme: vi.fn(),
    getStoredTheme: vi.fn(),
    defaultTheme: {}
}));

// Mock DOM
const appendChildMock = vi.fn();
const removeMock = vi.fn();
let createElementMock;

beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    createElementMock = vi.spyOn(document, 'createElement').mockImplementation((tag) => {
        if (tag === 'link') {
            return { id: '', rel: '', href: '', remove: removeMock };
        }
        return {};
    });

    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
        if (id === 'dynamic-font-link') {
             return { remove: removeMock };
        }
        return null;
    });

    document.head.appendChild = appendChildMock;
    window.dispatchEvent = vi.fn();
});

describe('appearanceStore — getAppearance', () => {
    it('retorna defaultAppearance quando não há nada no localStorage', () => {
        const appearance = getAppearance();
        expect(appearance).toEqual(defaultAppearance);
    });

    it('retorna dados mesclados com defaultAppearance', () => {
        localStorage.setItem('inove_appearance', JSON.stringify({ fontFamily: 'Lato' }));
        const appearance = getAppearance();
        expect(appearance.fontFamily).toBe('Lato');
        expect(appearance.heroHeadline).toBe(defaultAppearance.heroHeadline);
    });
});

describe('appearanceStore — saveAppearance', () => {
    it('salva aparência no localStorage, chama saveTheme e dispatchEvent', () => {
        const customAppearance = { ...defaultAppearance, fontFamily: 'Roboto' };
        
        saveAppearance(customAppearance, { primary: '#000' });
        
        const stored = JSON.parse(localStorage.getItem('inove_appearance'));
        expect(stored.fontFamily).toBe('Roboto');
        expect(themeProvider.saveTheme).toHaveBeenCalledWith({ primary: '#000' });
        expect(window.dispatchEvent).toHaveBeenCalled();
    });
});

describe('appearanceStore — applyFont', () => {
    it('cria link de fonte e adiciona ao head', () => {
        applyFont('Open Sans');
        expect(createElementMock).toHaveBeenCalledWith('link');
        expect(appendChildMock).toHaveBeenCalled();
        expect(document.body.style.fontFamily).toBe('"Open Sans", sans-serif');
    });
});
