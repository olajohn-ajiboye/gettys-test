/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock formatDate function for consistent date formatting in tests
vi.mock('../utils/dateUtils', () => ({
    formatDate: (date: any) => new Date(date).toLocaleDateString('en-US')
}));

// Mock window.matchMedia which is not available in JSDOM
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
    }))
});

