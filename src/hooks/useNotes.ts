import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types';
import { apiService } from '../services/apiService';

export const useNotes = (lessonId?: string) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getNotes(lessonId);
      setNotes(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.createNote(note);
    setNotes((prev) => [...prev, response.data]);
    return response.data;
  };

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    const response = await apiService.updateNote(noteId, updates);
    setNotes((prev) => prev.map((n) => (n.id === noteId ? response.data : n)));
    return response.data;
  };

  const deleteNote = async (noteId: string) => {
    await apiService.deleteNote(noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  return { notes, loading, error, createNote, updateNote, deleteNote, refetch: fetchNotes };
};







