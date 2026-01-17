import { Course, Chapter, Lesson, Badge, User } from '../types';

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
  const lessonTitles: Record<string, string[]> = {
    'chapter-1-1': [
      'Introduction to Arrays',
      'Array Operations and Algorithms', 
      'Introduction to Linked Lists',
      'Stacks - Last In, First Out',
      'Queues - First In, First Out'
    ],
    'chapter-1-2': [
      'Binary Trees Basics',
      'Tree Traversals',
      'Binary Search Trees',
      'AVL Trees and Balancing',
      'Heap Data Structure'
    ],
    'chapter-1-3': [
      'Hash Tables Introduction',
      'Hash Functions and Collisions',
      'Hash Maps and Hash Sets',
      'Applications of Hashing',
      'Advanced Hashing Techniques'
    ],
    'chapter-1-4': [
      'Graphs Introduction',
      'Graph Representations',
      'Depth-First Search (DFS)',
      'Breadth-First Search (BFS)',
      'Graph Applications'
    ],
  };

  const titles = lessonTitles[chapterId] || Array.from({ length: count }, (_, i) => `Lesson ${i + 1}`);
  
  return Array.from({ length: count }, (_, i) => ({
    id: `lesson-${chapterId}-${i + 1}`,
    chapterId,
    title: titles[i],
    content: `# ${titles[i]}\n\nThis lesson covers important concepts about ${titles[i].toLowerCase()}. Content will be loaded from the course content library.\n\n## Practice\n\nTry the concepts you learned in the [Code Editor](/editor)!`,
    order: startOrder + i,
    duration: 15 + i * 5,
    completed: i < 2,
    unlocked: i === 0 || i <= 2,
  }));
};

// Mock Chapters
const createChapters = (courseId: string, count: number): Chapter[] => {
  const chapterTitles: Record<string, string[]> = {
    '1': ['Linear Data Structures', 'Trees and Hierarchical Structures', 'Hash-Based Structures', 'Graphs and Networks'],
    '2': ['Sorting Algorithms', 'Searching Algorithms', 'Dynamic Programming'],
    '3': ['Advanced Trees', 'Advanced Graphs'],
    '4': ['Graph Traversal', 'Shortest Path Algorithms', 'Minimum Spanning Trees'],
    '5': ['DP Fundamentals', 'DP Patterns', 'Advanced DP'],
  };

  const chapterDescriptions: Record<string, string[]> = {
    '1': [
      'Master arrays, linked lists, stacks, and queues - the building blocks of programming',
      'Understand binary trees, BSTs, and tree traversal techniques',
      'Learn about hash tables, hash functions, and collision resolution',
      'Explore graph representations and basic graph algorithms'
    ],
    '2': [
      'Learn bubble sort, merge sort, quick sort, and their complexities',
      'Master linear search, binary search, and search optimizations',
      'Understand memoization, tabulation, and solving optimization problems'
    ],
    '3': [
      'Study AVL trees, Red-Black trees, B-trees, and Tries',
      'Advanced graph algorithms including Dijkstra, Bellman-Ford, and Floyd-Warshall'
    ],
    '4': [
      'Deep dive into DFS, BFS, and their applications',
      'Learn Dijkstra\'s, Bellman-Ford, and A* algorithms',
      'Master Kruskal\'s and Prim\'s algorithms for MST'
    ],
    '5': [
      'Introduction to dynamic programming concepts and techniques',
      'Common DP patterns: knapsack, LCS, LIS, and more',
      'Complex DP problems and optimization strategies'
    ],
  };

  const titles = chapterTitles[courseId] || Array.from({ length: count }, (_, i) => `Chapter ${i + 1}`);
  const descriptions = chapterDescriptions[courseId] || Array.from({ length: count }, (_, i) => `Learn about chapter ${i + 1} concepts`);

  let lessonOrder = 1;
  return Array.from({ length: count }, (_, i) => {
    const lessons = createLessons(`chapter-${courseId}-${i + 1}`, 5, lessonOrder);
    lessonOrder += lessons.length;
    return {
      id: `chapter-${courseId}-${i + 1}`,
      courseId,
      title: titles[i],
      description: descriptions[i],
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







