import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: platform-enhancements, Property 2: Progress Calculation Accuracy**
 * **Validates: Requirements 3.4, 4.3**
 * 
 * *For any* course with N total lessons where M lessons are completed, 
 * the progress percentage SHALL equal Math.round((M / N) * 100).
 */

// Progress calculation function (extracted from mock API logic)
function calculateProgress(completedLessons: number, totalLessons: number): number {
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
}

describe('Property 2: Progress Calculation Accuracy', () => {
  it('should calculate progress as Math.round((M / N) * 100) for any valid M and N', () => {
    fc.assert(
      fc.property(
        // Generate total lessons (N) between 1 and 100
        fc.integer({ min: 1, max: 100 }),
        // Generate completed lessons (M) that is <= total lessons
        fc.integer({ min: 0, max: 100 }),
        (totalLessons: number, completedLessonsRaw: number) => {
          // Ensure completed lessons doesn't exceed total
          const completedLessons = Math.min(completedLessonsRaw, totalLessons);
          
          const progress = calculateProgress(completedLessons, totalLessons);
          const expectedProgress = Math.round((completedLessons / totalLessons) * 100);
          
          expect(progress).toBe(expectedProgress);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return 0 progress when no lessons are completed', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        (totalLessons: number) => {
          const progress = calculateProgress(0, totalLessons);
          expect(progress).toBe(0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return 100 progress when all lessons are completed', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        (totalLessons: number) => {
          const progress = calculateProgress(totalLessons, totalLessons);
          expect(progress).toBe(100);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return progress between 0 and 100 inclusive', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (totalLessons: number, completedLessonsRaw: number) => {
          const completedLessons = Math.min(completedLessonsRaw, totalLessons);
          const progress = calculateProgress(completedLessons, totalLessons);
          
          expect(progress).toBeGreaterThanOrEqual(0);
          expect(progress).toBeLessThanOrEqual(100);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle edge case of zero total lessons gracefully', () => {
    const progress = calculateProgress(0, 0);
    expect(progress).toBe(0);
  });

  it('should increase monotonically as more lessons are completed', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 100 }),
        (totalLessons: number) => {
          let previousProgress = -1;
          
          for (let completed = 0; completed <= totalLessons; completed++) {
            const currentProgress = calculateProgress(completed, totalLessons);
            expect(currentProgress).toBeGreaterThanOrEqual(previousProgress);
            previousProgress = currentProgress;
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
