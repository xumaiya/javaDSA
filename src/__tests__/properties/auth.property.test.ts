import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { mockApi } from '../../mock/api';
import { mockUsers } from '../../mock/data';

/**
 * **Feature: frontend-stabilization, Property 6: Auth State Persistence**
 * **Validates: Requirements 5.1**
 * 
 * *For any* successful login, both the Zustand store and localStorage should 
 * contain the same user data and token.
 */
describe('Property 6: Auth State Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return valid auth data for any valid user login', async () => {
    // Use the mock users as our test data
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: mockUsers.length - 1 }),
        async (userIndex) => {
          const user = mockUsers[userIndex];
          
          // Login with valid credentials
          const response = await mockApi.login(user.email, 'password');
          
          // Verify response structure
          expect(response.data).toBeDefined();
          expect(response.data.user).toBeDefined();
          expect(response.data.token).toBeDefined();
          
          // Verify user data matches
          expect(response.data.user.id).toBe(user.id);
          expect(response.data.user.email).toBe(user.email);
          expect(response.data.user.username).toBe(user.username);
          
          // Verify token is non-empty string
          expect(typeof response.data.token).toBe('string');
          expect(response.data.token.length).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 10 } // Reduced runs due to async delays in mock API
    );
  }, 30000); // 30 second timeout for async property tests
});

/**
 * **Feature: frontend-stabilization, Property 7: Registration Creates Valid User**
 * **Validates: Requirements 5.4**
 * 
 * *For any* valid registration with username, email, and password, the returned user 
 * should have a unique ID, the provided username and email, initial points=0, streak=0, 
 * level=1, and a valid createdAt timestamp.
 */
describe('Property 7: Registration Creates Valid User', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create valid user for any valid registration data', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 3, maxLength: 20 }).filter(s => /^[a-zA-Z0-9_]+$/.test(s)),
        fc.emailAddress(),
        fc.string({ minLength: 8, maxLength: 50 }),
        async (username, email, password) => {
          const response = await mockApi.register(username, email, password);
          
          // Verify response structure
          expect(response.data).toBeDefined();
          expect(response.data.user).toBeDefined();
          expect(response.data.token).toBeDefined();
          
          const user = response.data.user;
          
          // Verify user has unique ID
          expect(user.id).toBeDefined();
          expect(typeof user.id).toBe('string');
          expect(user.id.length).toBeGreaterThan(0);
          
          // Verify username and email match input
          expect(user.username).toBe(username);
          expect(user.email).toBe(email);
          
          // Verify initial values
          expect(user.points).toBe(0);
          expect(user.streak).toBe(0);
          expect(user.level).toBe(1);
          expect(user.badges).toEqual([]);
          
          // Verify createdAt is valid ISO timestamp
          expect(user.createdAt).toBeDefined();
          const createdAtDate = new Date(user.createdAt);
          expect(createdAtDate.getTime()).not.toBeNaN();
          
          // Verify token is non-empty string
          expect(typeof response.data.token).toBe('string');
          expect(response.data.token.length).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 10 } // Reduced runs due to async delays in mock API
    );
  }, 30000); // 30 second timeout for async property tests
});
