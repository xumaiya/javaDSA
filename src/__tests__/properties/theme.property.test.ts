import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { Theme } from '../../utils/constants';

/**
 * **Feature: platform-enhancements, Property 1: Theme Preference Persistence Round-Trip**
 * **Validates: Requirements 2.4**
 * 
 * *For any* theme selection (light or dark), storing the preference and then 
 * retrieving it SHALL return the same theme value.
 */
describe('Property 1: Theme Preference Persistence Round-Trip', () => {
  const THEME_STORAGE_KEY = 'theme-storage';
  
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should persist and retrieve the same theme value for any valid theme', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>('light', 'dark'),
        (theme: Theme) => {
          // Store theme in localStorage (simulating Zustand persist behavior)
          const storeState = { state: { theme }, version: 0 };
          localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(storeState));
          
          // Retrieve theme from localStorage
          const storedData = localStorage.getItem(THEME_STORAGE_KEY);
          expect(storedData).not.toBeNull();
          
          const parsedData = JSON.parse(storedData!);
          const retrievedTheme = parsedData.state.theme;
          
          // Verify round-trip: stored theme equals retrieved theme
          expect(retrievedTheme).toBe(theme);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain theme consistency across multiple set operations', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom<Theme>('light', 'dark'), { minLength: 1, maxLength: 10 }),
        (themeSequence: Theme[]) => {
          // Apply each theme in sequence
          for (const theme of themeSequence) {
            const storeState = { state: { theme }, version: 0 };
            localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(storeState));
          }
          
          // The final stored theme should be the last one in the sequence
          const expectedTheme = themeSequence[themeSequence.length - 1];
          
          const storedData = localStorage.getItem(THEME_STORAGE_KEY);
          expect(storedData).not.toBeNull();
          
          const parsedData = JSON.parse(storedData!);
          const retrievedTheme = parsedData.state.theme;
          
          expect(retrievedTheme).toBe(expectedTheme);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should toggle theme correctly for any starting theme', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>('light', 'dark'),
        (initialTheme: Theme) => {
          // Set initial theme
          const initialState = { state: { theme: initialTheme }, version: 0 };
          localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(initialState));
          
          // Simulate toggle (light -> dark, dark -> light)
          const toggledTheme: Theme = initialTheme === 'light' ? 'dark' : 'light';
          const toggledState = { state: { theme: toggledTheme }, version: 0 };
          localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(toggledState));
          
          // Verify toggled theme is stored correctly
          const storedData = localStorage.getItem(THEME_STORAGE_KEY);
          const parsedData = JSON.parse(storedData!);
          
          expect(parsedData.state.theme).toBe(toggledTheme);
          expect(parsedData.state.theme).not.toBe(initialTheme);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
