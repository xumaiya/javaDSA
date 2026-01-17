import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { mockApi } from '../../mock/api';
import { mockUsers } from '../../mock/data';

/**
 * **Feature: frontend-stabilization, Property 2: Mock Login Returns Valid Auth Data**
 * **Validates: Requirements 4.1**
 * 
 * *For any* user in the mockUsers array, logging in with their email and the password 
 * "password" should return an object containing that user's data and a non-empty token string.
 */
describe('Property 2: Mock Login Returns Valid Auth Data', () => {
  it('should return valid auth data for any valid user login', async () => {
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
          
          // Verify user data matches the mock user
          expect(response.data.user.id).toBe(user.id);
          expect(response.data.user.email).toBe(user.email);
          expect(response.data.user.username).toBe(user.username);
          expect(response.data.user.points).toBe(user.points);
          expect(response.data.user.streak).toBe(user.streak);
          expect(response.data.user.level).toBe(user.level);
          
          // Verify token is non-empty string
          expect(typeof response.data.token).toBe('string');
          expect(response.data.token.length).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 10 } // Reduced runs due to async delays in mock API
    );
  }, 30000);

  it('should throw error for invalid credentials', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s !== 'password'),
        async (email, wrongPassword) => {
          // Attempt login with wrong password
          await expect(mockApi.login(email, wrongPassword)).rejects.toThrow('Invalid email or password');
          return true;
        }
      ),
      { numRuns: 10 }
    );
  }, 30000);
});

/**
 * **Feature: frontend-stabilization, Property 3: Note CRUD Round Trip**
 * **Validates: Requirements 4.3, 8.1, 8.2, 8.3**
 * 
 * *For any* note created with valid userId, lessonId, title, and content, the note 
 * should be retrievable by its ID. When updated, the changes should persist. 
 * When deleted, the note should no longer be retrievable.
 */
describe('Property 3: Note CRUD Round Trip', () => {
  // We need a fresh mockApi instance for each test to avoid state pollution
  // Since mockApi is a singleton, we'll track created notes and clean up
  const createdNoteIds: string[] = [];

  beforeEach(async () => {
    // Clean up any notes created in previous tests
    for (const noteId of createdNoteIds) {
      try {
        await mockApi.deleteNote(noteId);
      } catch {
        // Note may already be deleted, ignore
      }
    }
    createdNoteIds.length = 0;
  });

  it('should create, retrieve, update, and delete notes correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
        async (userId, lessonId, title, content) => {
          // CREATE: Create a new note
          const createResponse = await mockApi.createNote({
            userId,
            lessonId,
            title,
            content,
          });
          
          const createdNote = createResponse.data;
          createdNoteIds.push(createdNote.id);
          
          // Verify created note has correct data
          expect(createdNote.userId).toBe(userId);
          expect(createdNote.lessonId).toBe(lessonId);
          expect(createdNote.title).toBe(title);
          expect(createdNote.content).toBe(content);
          expect(createdNote.id).toBeDefined();
          expect(createdNote.createdAt).toBeDefined();
          expect(createdNote.updatedAt).toBeDefined();
          
          // READ: Retrieve the note by ID
          const getResponse = await mockApi.getNoteById(createdNote.id);
          expect(getResponse.data.id).toBe(createdNote.id);
          expect(getResponse.data.title).toBe(title);
          expect(getResponse.data.content).toBe(content);
          
          // UPDATE: Update the note
          const newTitle = title + '_updated';
          const newContent = content + '_updated';
          const updateResponse = await mockApi.updateNote(createdNote.id, {
            title: newTitle,
            content: newContent,
          });
          
          expect(updateResponse.data.title).toBe(newTitle);
          expect(updateResponse.data.content).toBe(newContent);
          
          // Verify update persisted
          const getUpdatedResponse = await mockApi.getNoteById(createdNote.id);
          expect(getUpdatedResponse.data.title).toBe(newTitle);
          expect(getUpdatedResponse.data.content).toBe(newContent);
          
          // DELETE: Delete the note
          await mockApi.deleteNote(createdNote.id);
          
          // Verify note is no longer retrievable
          await expect(mockApi.getNoteById(createdNote.id)).rejects.toThrow('Note not found');
          
          // Remove from tracking since it's deleted
          const idx = createdNoteIds.indexOf(createdNote.id);
          if (idx > -1) createdNoteIds.splice(idx, 1);
          
          return true;
        }
      ),
      { numRuns: 10 } // Reduced runs due to async delays
    );
  }, 60000);
});

/**
 * **Feature: frontend-stabilization, Property 8: Notes Filter by LessonId**
 * **Validates: Requirements 8.4**
 * 
 * *For any* lessonId filter applied to getNotes, all returned notes should have 
 * a lessonId matching the filter (or be empty if no matches).
 */
describe('Property 8: Notes Filter by LessonId', () => {
  const createdNoteIds: string[] = [];

  beforeEach(async () => {
    // Clean up any notes created in previous tests
    for (const noteId of createdNoteIds) {
      try {
        await mockApi.deleteNote(noteId);
      } catch {
        // Note may already be deleted, ignore
      }
    }
    createdNoteIds.length = 0;
  });

  it('should filter notes by lessonId correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            userId: fc.string({ minLength: 1, maxLength: 20 }),
            lessonId: fc.stringMatching(/^lesson-[a-z0-9]{1,10}$/),
            title: fc.string({ minLength: 1, maxLength: 50 }),
            content: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          { minLength: 2, maxLength: 5 }
        ),
        async (noteInputs) => {
          // Create multiple notes with different lessonIds
          const createdNotes = [];
          for (const input of noteInputs) {
            const response = await mockApi.createNote(input);
            createdNotes.push(response.data);
            createdNoteIds.push(response.data.id);
          }
          
          // Pick a lessonId to filter by
          const targetLessonId = noteInputs[0].lessonId;
          
          // Get notes filtered by lessonId
          const filteredResponse = await mockApi.getNotes(targetLessonId);
          
          // Verify all returned notes have the correct lessonId
          for (const note of filteredResponse.data) {
            expect(note.lessonId).toBe(targetLessonId);
          }
          
          // Verify the count matches expected
          const expectedCount = noteInputs.filter(n => n.lessonId === targetLessonId).length;
          expect(filteredResponse.data.length).toBeGreaterThanOrEqual(expectedCount);
          
          return true;
        }
      ),
      { numRuns: 5 } // Reduced runs due to multiple async operations
    );
  }, 60000);
});
