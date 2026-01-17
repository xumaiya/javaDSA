import { useState } from 'react';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { Note } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { useAuthStore } from '../store/authStore';

export const Notes = () => {
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [lessonId, setLessonId] = useState('');

  const handleOpenModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
      setLessonId(note.lessonId);
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
      setLessonId('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
    setLessonId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingNote) {
        await updateNote(editingNote.id, { title, content, lessonId });
      } else {
        await createNote({
          userId: user.id,
          lessonId: lessonId || 'general',
          title,
          content,
        });
      }
      handleCloseModal();
    } catch {
      alert('Failed to save note');
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(noteId);
    } catch {
      alert('Failed to delete note');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-olive-dark dark:text-olive-light">My Notes</h1>
          <p className="text-text-light dark:text-olive-light mt-2">
            Manage your learning notes
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(note)}
                      className="text-olive hover:text-olive-dark dark:text-olive-light"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-light dark:text-olive-light line-clamp-3 mb-2">
                  {note.content}
                </p>
                <p className="text-xs text-text-muted dark:text-text-muted">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-olive-light mx-auto mb-4" />
            <p className="text-text-light dark:text-olive-light mb-4">
              You don't have any notes yet
            </p>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Note
            </Button>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingNote ? 'Edit Note' : 'New Note'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Note title"
          />
          <div>
            <label className="block text-sm font-medium text-olive-dark dark:text-olive-light mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={8}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent dark:bg-olive dark:border-olive-dark dark:text-white dark:placeholder-olive-light"
              placeholder="Write your note here..."
            />
          </div>
          <Input
            label="Lesson ID (optional)"
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
            placeholder="lesson-1-1"
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingNote ? 'Update' : 'Create'} Note
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

