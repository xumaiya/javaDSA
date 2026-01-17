import { Course, Chapter, Lesson, Badge, User, LeaderboardEntry } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'alice_coder',
    email: 'alice@example.com',
    points: 1250,
    streak: 7,
    level: 5,
    badges: [],
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    username: 'bob_dev',
    email: 'bob@example.com',
    points: 980,
    streak: 3,
    level: 4,
    badges: [],
    createdAt: '2024-01-20T10:00:00Z',
  },
];

// Mock Badges
export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    rarity: 'common',
  },
  {
    id: '2',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    rarity: 'rare',
  },
  {
    id: '3',
    name: 'Chapter Master',
    description: 'Complete an entire chapter',
    icon: '📚',
    rarity: 'epic',
  },
  {
    id: '4',
    name: 'Algorithm Guru',
    description: 'Score 1000+ points',
    icon: '🏆',
    rarity: 'legendary',
  },
  {
    id: '5',
    name: 'Early Bird',
    description: 'Complete 5 lessons before 8 AM',
    icon: '🌅',
    rarity: 'rare',
  },
  {
    id: '6',
    name: 'Night Owl',
    description: 'Complete 10 lessons after 10 PM',
    icon: '🦉',
    rarity: 'rare',
  },
];

// Mock Lessons
const createLessons = (chapterId: string, count: number, startOrder: number): Lesson[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `lesson-${chapterId}-${i + 1}`,
    chapterId,
    title: `Lesson ${i + 1}`,
    content: `# Lesson ${i + 1} Content\n\nThis is the content for lesson ${i + 1}. It contains markdown formatted text.\n\n## Key Concepts\n\n- Concept 1\n- Concept 2\n- Concept 3\n\n## Code Example\n\n\`\`\`java\npublic class Example {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n\`\`\`\n\n## Practice\n\nTry implementing this concept in your own code!`,
    order: startOrder + i,
    duration: 15 + i * 5,
    completed: i < 2, // First 2 lessons completed
    unlocked: i === 0 || i <= 2, // First 3 lessons unlocked
  }));
};

// Mock Chapters
const createChapters = (courseId: string, count: number): Chapter[] => {
  let lessonOrder = 1;
  return Array.from({ length: count }, (_, i) => {
    const lessons = createLessons(`chapter-${courseId}-${i + 1}`, 5, lessonOrder);
    lessonOrder += lessons.length;
    return {
      id: `chapter-${courseId}-${i + 1}`,
      courseId,
      title: `Chapter ${i + 1}`,
      description: `Learn about chapter ${i + 1} concepts`,
      order: i + 1,
      lessons,
      progress: i === 0 ? 40 : i === 1 ? 20 : 0,
      unlocked: i === 0 || i === 1,
    };
  });
};

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Data Structures Fundamentals',
    description: 'Learn the essential data structures every programmer needs to know. From arrays to trees, master the building blocks of efficient algorithms.',
    difficulty: 'beginner',
    duration: 300,
    chapters: createChapters('1', 4),
    progress: 25,
    enrolledAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Algorithm Design & Analysis',
    description: 'Master algorithm design techniques including divide and conquer, dynamic programming, and greedy algorithms.',
    difficulty: 'intermediate',
    duration: 450,
    chapters: createChapters('2', 3),
    progress: 0,
  },
  {
    id: '3',
    title: 'Advanced Data Structures',
    description: 'Explore advanced data structures like B-trees, skip lists, and bloom filters used in real-world systems.',
    difficulty: 'advanced',
    duration: 375,
    chapters: createChapters('3', 2),
    progress: 0,
  },
  {
    id: '4',
    title: 'Graph Algorithms',
    description: 'Master graph theory and algorithms including BFS, DFS, shortest paths, and minimum spanning trees.',
    difficulty: 'intermediate',
    duration: 420,
    chapters: createChapters('4', 3),
    progress: 0,
  },
  {
    id: '5',
    title: 'Dynamic Programming Mastery',
    description: 'Learn to solve complex optimization problems using dynamic programming techniques from basics to advanced patterns.',
    difficulty: 'advanced',
    duration: 525,
    chapters: createChapters('5', 3),
    progress: 0,
  },
];

// Mock Leaderboard
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user: { id: '1', username: 'alice_coder', avatar: undefined },
    points: 1250,
    streak: 7,
    level: 5,
  },
  {
    rank: 2,
    user: { id: '2', username: 'bob_dev', avatar: undefined },
    points: 980,
    streak: 3,
    level: 4,
  },
  {
    rank: 3,
    user: { id: '3', username: 'charlie_java', avatar: undefined },
    points: 850,
    streak: 5,
    level: 4,
  },
  {
    rank: 4,
    user: { id: '4', username: 'diana_coder', avatar: undefined },
    points: 720,
    streak: 2,
    level: 3,
  },
  {
    rank: 5,
    user: { id: '5', username: 'eve_algo', avatar: undefined },
    points: 650,
    streak: 4,
    level: 3,
  },
];







