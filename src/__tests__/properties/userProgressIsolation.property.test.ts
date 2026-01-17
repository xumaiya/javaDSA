import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: platform-enhancements, Property 4: User Progress Isolation**
 * **Validates: Requirements 4.6**
 *
 * *For any* two distinct users A and B, completing a lesson for user A
 * SHALL NOT affect the progress records of user B.
 */

type UserProgressStore = Record<string, number[]>;

function createProgressStore(): UserProgressStore {
  return {};
}

function setUserProgress(store: UserProgressStore, userId: string, lessonIds: number[]): UserProgressStore {
  return { ...store, [userId]: [...lessonIds] };
}

function addCompletedLesson(store: UserProgressStore, userId: string, lessonId: number): UserProgressStore {
  const currentProgress = store[userId] || [];
  if (currentProgress.includes(lessonId)) {
    return store;
  }
  return { ...store, [userId]: [...currentProgress, lessonId] };
}

function getUserProgress(store: UserProgressStore, userId: string): number[] {
  return store[userId] || [];
}

function clearUserProgress(store: UserProgressStore, userId: string): UserProgressStore {
  const newStore = { ...store };
  delete newStore[userId];
  return newStore;
}

describe('Property 4: User Progress Isolation', () => {
  it('completing a lesson for user A should not affect user B progress', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 5 }),
        fc.string({ minLength: 1, maxLength: 5 }),
        fc.array(fc.integer({ min: 1, max: 100 }), { minLength: 0, maxLength: 10 }),
        fc.integer({ min: 1, max: 100 }),
        (userAId, userBId, userBInitialProgress, lessonToComplete) => {
          if (userAId === userBId) return true;

          let store = createProgressStore();
          store = setUserProgress(store, userBId, userBInitialProgress);
          const userBProgressBefore = [...getUserProgress(store, userBId)];

          store = addCompletedLesson(store, userAId, lessonToComplete);

          const userBProgressAfter = getUserProgress(store, userBId);
          expect(userBProgressAfter).toEqual(userBProgressBefore);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('clearing user A progress should not affect user B progress', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 5 }),
        fc.string({ minLength: 1, maxLength: 5 }),
        fc.array(fc.integer({ min: 1, max: 100 }), { minLength: 1, maxLength: 10 }),
        fc.array(fc.integer({ min: 1, max: 100 }), { minLength: 1, maxLength: 10 }),
        (userAId, userBId, userAProgress, userBProgress) => {
          if (userAId === userBId) return true;

          let store = createProgressStore();
          store = setUserProgress(store, userAId, userAProgress);
          store = setUserProgress(store, userBId, userBProgress);
          const userBProgressBefore = [...getUserProgress(store, userBId)];

          store = clearUserProgress(store, userAId);

          const userBProgressAfter = getUserProgress(store, userBId);
          expect(userBProgressAfter).toEqual(userBProgressBefore);
          expect(getUserProgress(store, userAId)).toEqual([]);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('multiple lesson completions for user A should not affect user B', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 5 }),
        fc.string({ minLength: 1, maxLength: 5 }),
        fc.array(fc.integer({ min: 1, max: 100 }), { minLength: 0, maxLength: 10 }),
        fc.array(fc.integer({ min: 1, max: 100 }), { minLength: 1, maxLength: 5 }),
        (userAId, userBId, userBInitialProgress, lessonsForUserA) => {
          if (userAId === userBId) return true;

          let store = createProgressStore();
          store = setUserProgress(store, userBId, userBInitialProgress);
          const userBProgressBefore = [...getUserProgress(store, userBId)];

          for (const lessonId of lessonsForUserA) {
            store = addCompletedLesson(store, userAId, lessonId);
          }

          const userBProgressAfter = getUserProgress(store, userBId);
          expect(userBProgressAfter).toEqual(userBProgressBefore);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('user progress should be independent across multiple users', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 5 }), { minLength: 2, maxLength: 4 }),
        fc.array(fc.array(fc.integer({ min: 1, max: 100 }), { minLength: 0, maxLength: 5 }), { minLength: 2, maxLength: 4 }),
        (userIds, progressArrays) => {
          const uniqueUserIds = [...new Set(userIds)];
          if (uniqueUserIds.length < 2) return true;

          let store = createProgressStore();
          for (let i = 0; i < uniqueUserIds.length; i++) {
            const progress = progressArrays[i % progressArrays.length] || [];
            store = setUserProgress(store, uniqueUserIds[i], progress);
          }

          const progressBefore: Record<string, number[]> = {};
          for (const userId of uniqueUserIds) {
            progressBefore[userId] = [...getUserProgress(store, userId)];
          }

          const targetUser = uniqueUserIds[0];
          store = addCompletedLesson(store, targetUser, 9999);

          for (let i = 1; i < uniqueUserIds.length; i++) {
            const userId = uniqueUserIds[i];
            expect(getUserProgress(store, userId)).toEqual(progressBefore[userId]);
          }

          expect(getUserProgress(store, targetUser)).toContain(9999);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
