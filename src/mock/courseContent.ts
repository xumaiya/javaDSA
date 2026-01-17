// Comprehensive DSA Course Content
// Each lesson includes detailed explanations, examples, and practice links

// Import modular chapter content
import { chapter1Lessons } from './content/course1/chapter1.js';
import { chapter2Lessons } from './content/course1/chapter2.js';
import { chapter3Lessons } from './content/course1/chapter3.js';

// Merge all lesson content
export const COURSE_CONTENT: Record<string, string> = {
  // Course 1: Data Structures Fundamentals
  // Chapter 1: Linear Data Structures (Arrays, Linked Lists, Stacks)
  ...chapter1Lessons,
  
  // Chapter 2: Trees (Binary Trees, BST, Tree Traversals)
  ...chapter2Lessons,
  
  // Chapter 3: Hash Tables (Intro, Hash Functions, Applications)
  ...chapter3Lessons,

  // Default template for lessons not yet created
  'default': `# Lesson Content

## Introduction

This lesson covers important DSA concepts with practical examples and code implementations.

## What You'll Learn

- Core concepts explained clearly
- Practical code examples in Java
- Real-world applications
- Practice problems

## Code Example

Try implementing the concepts in the [Code Editor](/editor)!

## Key Takeaways

✅ Master the fundamentals
✅ Practice with real code
✅ Apply to solve problems
`,
};

// Export function to get lesson content
export function getLessonContent(lessonId: string): string {
  return COURSE_CONTENT[lessonId] || COURSE_CONTENT['default'];
}
