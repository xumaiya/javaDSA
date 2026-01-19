import { Course, Chapter, Lesson, Badge, User } from '../types';

// Mock Users - TEST DATA ONLY (Not used in production, only for property-based tests)
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
    'chapter-1-1': ['What is an Array?', 'Creating Arrays in Java', 'Accessing Array Elements', 'Array Length and Bounds', 'Common Array Mistakes'],
    'chapter-1-2': ['Adding Elements to Arrays', 'Removing Elements', 'Searching in Arrays', 'Sorting Arrays in Java', 'Array Practice Problems'],
    'chapter-1-3': ['What are 2D Arrays?', 'Creating 2D Arrays in Java', 'Accessing 2D Array Elements', 'Looping Through 2D Arrays', '2D Array Applications'],
    'chapter-2-1': ['What is a Linked List?', 'Nodes and References', 'Creating a Linked List in Java', 'Traversing a Linked List', 'Linked List vs Array'],
    'chapter-2-2': ['Singly Linked Lists', 'Doubly Linked Lists', 'Circular Linked Lists', 'When to Use Each Type', 'Comparing List Types'],
    'chapter-2-3': ['Inserting at Beginning', 'Inserting at End', 'Deleting Nodes', 'Searching in Linked Lists', 'Reversing a Linked List'],
    'chapter-3-1': ['What is a Stack?', 'Stack Operations: Push and Pop', 'Implementing Stack in Java', 'Stack Applications', 'Stack Practice Problems'],
    'chapter-3-2': ['What is a Queue?', 'Queue Operations: Enqueue and Dequeue', 'Implementing Queue in Java', 'Queue Applications', 'Queue Practice Problems'],
    'chapter-4-1': ['What is a Binary Tree?', 'Tree Terminology', 'Creating Trees in Java', 'Tree Node Structure', 'Tree vs Linear Structures'],
    'chapter-4-2': ['Preorder Traversal', 'Inorder Traversal', 'Postorder Traversal', 'Level Order Traversal', 'When to Use Each Traversal'],
    'chapter-4-3': ['What is a BST?', 'BST Properties', 'Inserting in BST', 'Searching in BST', 'Deleting from BST'],
    'chapter-5-1': ['What is Hashing?', 'Hash Functions Explained', 'Hash Tables in Java', 'HashMap and HashSet', 'When to Use Hashing'],
    'chapter-5-2': ['Understanding Collisions', 'Chaining Method', 'Open Addressing', 'Load Factor', 'Handling Collisions in Java'],
    'chapter-6-1': ['What is a Heap?', 'Min Heap vs Max Heap', 'Heap Properties', 'Implementing Heap in Java', 'Heapify Operation'],
    'chapter-6-2': ['What is a Priority Queue?', 'PriorityQueue Class in Java', 'Priority Queue Operations', 'Priority Queue Applications', 'Practice Problems'],
    'chapter-7-1': ['What is a Graph?', 'Graph Terminology', 'Directed vs Undirected Graphs', 'Weighted Graphs', 'Representing Graphs in Java'],
    'chapter-7-2': ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'DFS vs BFS', 'Implementing DFS in Java', 'Implementing BFS in Java'],
    'chapter-7-3': ['Shortest Path Problem', 'Dijkstra\'s Algorithm', 'Bellman-Ford Algorithm', 'Graph Applications', 'Advanced Graph Problems'],
  };

  const titles = lessonTitles[chapterId] || Array.from({ length: count }, (_, i) => `Lesson ${i + 1}`);
  
  return Array.from({ length: count }, (_, i) => ({
    id: `lesson-${chapterId}-${i + 1}`,
    chapterId,
    title: titles[i],
    content: `# ${titles[i]}\n\nThis lesson covers important concepts about ${titles[i].toLowerCase()}. Content will be loaded from the course content library.\n\n## Practice\n\nTry the concepts you learned in the [Code Editor](/editor)!`,
    order: startOrder + i,
    duration: 15 + i * 5,
    completed: false, // Will be determined dynamically from backend
    unlocked: i === 0 || i <= 2, // First 3 lessons unlocked by default
  }));
};

// Mock Chapters
const createChapters = (courseId: string, count: number): Chapter[] => {
  const chapterTitles: Record<string, string[]> = {
    '1': ['Array Basics in Java', 'Array Operations', 'Multi-dimensional Arrays'],
    '2': ['Linked List Fundamentals', 'Types of Linked Lists', 'Linked List Operations'],
    '3': ['Understanding Stacks', 'Understanding Queues'],
    '4': ['Binary Trees', 'Tree Traversals', 'Binary Search Trees'],
    '5': ['Hash Tables Basics', 'Hash Functions & Collision Handling'],
    '6': ['Heap Fundamentals', 'Priority Queues in Java'],
    '7': ['Graph Basics', 'Graph Traversal Algorithms', 'Advanced Graph Algorithms'],
  };

  const chapterDescriptions: Record<string, string[]> = {
    '1': [
      'Learn how to create and use arrays in Java - like organizing your toys in numbered boxes',
      'Discover how to add, remove, and search for items in arrays using simple Java code',
      'Explore 2D arrays - think of them as a grid or a chessboard where you can store lots of data'
    ],
    '2': [
      'Understand how linked lists connect data like train cars - each one links to the next',
      'Learn about singly, doubly, and circular linked lists - different ways to connect your data',
      'Master inserting, deleting, and finding items in linked lists with Java examples'
    ],
    '3': [
      'Learn stacks - like a stack of books where you can only take from the top. Perfect for undo buttons!',
      'Understand queues - like waiting in line at a store. First person in is first person out!'
    ],
    '4': [
      'Discover binary trees - each parent has up to two children, like a family tree',
      'Learn three ways to visit every node: preorder, inorder, and postorder traversals',
      'Master BSTs where smaller values go left and bigger values go right - makes searching easy!'
    ],
    '5': [
      'Learn how hash tables use special codes to find data instantly - like a super-fast phone book',
      'Understand hash functions and what happens when two items want the same spot (collision!)'
    ],
    '6': [
      'Discover heaps - special trees that always keep the biggest or smallest item at the top',
      'Learn how Java uses heaps to create priority queues - where important items jump to the front'
    ],
    '7': [
      'Understand graphs - dots (vertices) connected by lines (edges), like a map of cities and roads',
      'Learn BFS and DFS - two ways to explore a graph, like exploring a maze',
      'Master shortest path algorithms - finding the quickest route from one place to another'
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
      progress: 0, // Will be calculated dynamically based on completed lessons
      unlocked: i === 0 || i === 1,
    };
  });
};

// Mock Courses - DSA in Java
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'DSA in Java - Arrays',
    description: 'Think of arrays like a row of lockers at school - each locker has a number and can hold your stuff. Learn how to store and find things super fast using Java arrays!',
    difficulty: 'beginner',
    duration: 180,
    chapters: createChapters('1', 3),
    progress: 0, // Will be calculated dynamically
    enrolledAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'DSA in Java - Linked Lists',
    description: 'Imagine a treasure hunt where each clue points to the next one. That\'s how linked lists work in Java! Each piece of data knows where the next piece is hiding.',
    difficulty: 'beginner',
    duration: 200,
    chapters: createChapters('2', 3),
    progress: 0, // Will be calculated dynamically
  },
  {
    id: '3',
    title: 'DSA in Java - Stacks & Queues',
    description: 'Stacks are like a pile of plates (last one on, first one off), and queues are like a lunch line (first in line, first to eat). Learn both in Java!',
    difficulty: 'beginner',
    duration: 160,
    chapters: createChapters('3', 2),
    progress: 0, // Will be calculated dynamically
  },
  {
    id: '4',
    title: 'DSA in Java - Trees',
    description: 'Trees in programming are like family trees, but upside down! Start from one person (the root) and branch out to their kids and grandkids. Perfect for organizing data in Java.',
    difficulty: 'intermediate',
    duration: 240,
    chapters: createChapters('4', 3),
    progress: 0, // Will be calculated dynamically
  },
  {
    id: '5',
    title: 'DSA in Java - Hashing',
    description: 'Hashing is like having a magic filing system where you can find any paper instantly! Learn how Java uses hash tables to make searching super speedy.',
    difficulty: 'intermediate',
    duration: 180,
    chapters: createChapters('5', 2),
    progress: 0, // Will be calculated dynamically
  },
  {
    id: '6',
    title: 'DSA in Java - Heaps',
    description: 'Heaps are special trees that always keep the biggest (or smallest) item at the top - like a leaderboard that updates itself! Master priority queues in Java.',
    difficulty: 'intermediate',
    duration: 160,
    chapters: createChapters('6', 2),
    progress: 0, // Will be calculated dynamically
  },
  {
    id: '7',
    title: 'DSA in Java - Graphs',
    description: 'Graphs are like maps showing how cities connect with roads. Learn how to represent friendships, networks, and paths using Java graphs!',
    difficulty: 'advanced',
    duration: 280,
    chapters: createChapters('7', 3),
    progress: 0, // Will be calculated dynamically
  },
];







