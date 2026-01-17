-- Initial data for DSA Learning Platform

-- Insert initial badges
INSERT INTO badges (name, description, icon, rarity, created_at, updated_at) VALUES
('First Steps', 'Complete your first lesson', '🎯', 'COMMON', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Week Warrior', 'Maintain a 7-day streak', '🔥', 'RARE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chapter Master', 'Complete an entire chapter', '📚', 'EPIC', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Algorithm Guru', 'Score 1000+ points', '🏆', 'LEGENDARY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Early Bird', 'Complete 5 lessons before 8 AM', '🌅', 'RARE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Night Owl', 'Complete 10 lessons after 10 PM', '🦉', 'RARE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert demo user (password: password123 - BCrypt encoded)
INSERT INTO users (username, email, password, role, points, streak, level, created_at, updated_at) VALUES
('demo', 'demo@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQb9tLqnKs3Hs8QjHBnOHNHOHNHO', 'STUDENT', 150, 5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('admin', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQb9tLqnKs3Hs8QjHBnOHNHOHNHO', 'ADMIN', 500, 10, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample courses
INSERT INTO courses (title, description, thumbnail, difficulty, duration, created_at, updated_at) VALUES
('Data Structures Fundamentals', 'Learn the essential data structures every programmer needs to know. From arrays to trees, master the building blocks of efficient algorithms.', '/images/ds-fundamentals.jpg', 'BEGINNER', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Algorithm Design & Analysis', 'Master algorithm design techniques including divide and conquer, dynamic programming, and greedy algorithms.', '/images/algo-design.jpg', 'INTERMEDIATE', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Advanced Data Structures', 'Explore advanced data structures like B-trees, skip lists, and bloom filters used in real-world systems.', '/images/advanced-ds.jpg', 'ADVANCED', 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Graph Algorithms', 'Master graph theory and algorithms including BFS, DFS, shortest paths, and minimum spanning trees.', '/images/graph-algo.jpg', 'INTERMEDIATE', 28, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dynamic Programming Mastery', 'Learn to solve complex optimization problems using dynamic programming techniques from basics to advanced patterns.', '/images/dp-mastery.jpg', 'ADVANCED', 35, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert chapters for Data Structures Fundamentals
INSERT INTO chapters (course_id, title, description, chapter_order, created_at, updated_at) VALUES
(1, 'Arrays and Strings', 'Understanding the most fundamental data structures', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Linked Lists', 'Learn about singly and doubly linked lists', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Stacks and Queues', 'LIFO and FIFO data structures', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Trees and Graphs', 'Hierarchical and network data structures', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert chapters for Algorithm Design
INSERT INTO chapters (course_id, title, description, chapter_order, created_at, updated_at) VALUES
(2, 'Sorting Algorithms', 'From bubble sort to quicksort', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Searching Algorithms', 'Linear and binary search techniques', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Dynamic Programming', 'Solving complex problems by breaking them down', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert chapters for Advanced DS
INSERT INTO chapters (course_id, title, description, chapter_order, created_at, updated_at) VALUES
(3, 'Balanced Trees', 'AVL trees, Red-Black trees, and B-trees', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Hash Tables', 'Advanced hashing techniques', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert chapters for Graph Algorithms
INSERT INTO chapters (course_id, title, description, chapter_order, created_at, updated_at) VALUES
(4, 'Graph Fundamentals', 'Introduction to graphs, representations, and basic terminology', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Graph Traversals', 'Breadth-First Search (BFS) and Depth-First Search (DFS)', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Shortest Path Algorithms', 'Dijkstra, Bellman-Ford, and Floyd-Warshall algorithms', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert chapters for Dynamic Programming Mastery
INSERT INTO chapters (course_id, title, description, chapter_order, created_at, updated_at) VALUES
(5, '1D Dynamic Programming', 'Fibonacci, climbing stairs, and linear DP problems', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, '2D Dynamic Programming', 'Grid problems, LCS, and matrix chain multiplication', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Advanced DP Patterns', 'State compression, digit DP, and optimization techniques', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- Insert lessons for Arrays and Strings chapter
INSERT INTO lessons (chapter_id, title, content, lesson_order, duration, created_at, updated_at) VALUES
(1, 'Introduction to Arrays', '# Introduction to Arrays

Arrays are one of the most fundamental data structures in computer science. They store elements in contiguous memory locations, allowing for efficient random access.

## Key Characteristics

- **Fixed Size**: Traditional arrays have a fixed size determined at creation
- **Homogeneous**: All elements must be of the same type
- **Index-based**: Elements are accessed using zero-based indices
- **O(1) Access**: Random access to any element is constant time

## Common Operations

| Operation | Time Complexity |
|-----------|----------------|
| Access    | O(1)           |
| Search    | O(n)           |
| Insert    | O(n)           |
| Delete    | O(n)           |

## Example in Java

```java
int[] numbers = new int[5];
numbers[0] = 10;
numbers[1] = 20;
System.out.println(numbers[0]); // Output: 10
```

## When to Use Arrays

- When you need fast random access
- When the size is known in advance
- When memory efficiency is important', 1, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(1, 'Array Operations', '# Array Operations

Learn the essential operations you can perform on arrays.

## Traversal

Visiting each element in the array:

```java
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}
```

## Insertion

Adding an element requires shifting:

```java
// Insert at index 2
for (int i = arr.length - 1; i > 2; i--) {
    arr[i] = arr[i - 1];
}
arr[2] = newValue;
```

## Two-Pointer Technique

A common pattern for array problems:

```java
int left = 0, right = arr.length - 1;
while (left < right) {
    // Process elements
    left++;
    right--;
}
```', 2, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(1, 'String Manipulation', '# String Manipulation

Strings are sequences of characters and are fundamental to programming.

## String Basics

In most languages, strings are immutable:

```java
String s = "Hello";
s = s + " World"; // Creates a new string
```

## Common String Operations

### Concatenation
```java
String result = str1 + str2;
```

### Substring
```java
String sub = str.substring(0, 5);
```

### Character Access
```java
char c = str.charAt(0);
```', 3, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert lessons for Linked Lists chapter
INSERT INTO lessons (chapter_id, title, content, lesson_order, duration, created_at, updated_at) VALUES
(2, 'Singly Linked Lists', '# Singly Linked Lists

A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node.

## Node Structure

```java
class ListNode {
    int val;
    ListNode next;
    
    ListNode(int val) {
        this.val = val;
        this.next = null;
    }
}
```

## Advantages over Arrays

- Dynamic size
- Efficient insertions/deletions at the beginning
- No memory waste from unused capacity', 1, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 'Doubly Linked Lists', '# Doubly Linked Lists

A doubly linked list allows traversal in both directions.

## Node Structure

```java
class DoublyListNode {
    int val;
    DoublyListNode prev;
    DoublyListNode next;
}
```

## Advantages

- Bidirectional traversal
- Easier deletion when you have the node reference', 2, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert lessons for Stacks and Queues
INSERT INTO lessons (chapter_id, title, content, lesson_order, duration, created_at, updated_at) VALUES
(3, 'Stack Data Structure', '# Stack Data Structure

A stack is a Last-In-First-Out (LIFO) data structure.

## Operations

- **push(x)**: Add element to top - O(1)
- **pop()**: Remove and return top element - O(1)
- **peek()**: Return top element without removing - O(1)
- **isEmpty()**: Check if stack is empty - O(1)', 1, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(3, 'Queue Data Structure', '# Queue Data Structure

A queue is a First-In-First-Out (FIFO) data structure.

## Operations

- **enqueue(x)**: Add element to rear - O(1)
- **dequeue()**: Remove and return front element - O(1)
- **front()**: Return front element - O(1)
- **isEmpty()**: Check if queue is empty - O(1)', 2, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert lessons for Graph Fundamentals chapter (chapter_id: 10)
INSERT INTO lessons (chapter_id, title, content, lesson_order, duration, created_at, updated_at) VALUES
(10, 'Introduction to Graphs', '# Introduction to Graphs

A graph is a non-linear data structure consisting of vertices (nodes) and edges that connect them.

## Key Terminology

- **Vertex (Node)**: A fundamental unit of a graph
- **Edge**: A connection between two vertices
- **Directed Graph**: Edges have a direction
- **Undirected Graph**: Edges have no direction
- **Weighted Graph**: Edges have associated weights

## Graph Representations

### Adjacency Matrix
```java
int[][] adjMatrix = new int[V][V];
// adjMatrix[i][j] = 1 if edge exists
```

### Adjacency List
```java
List<List<Integer>> adjList = new ArrayList<>();
// More space efficient for sparse graphs
```

## When to Use Graphs

- Social networks (friends connections)
- Maps and navigation
- Web page linking
- Dependency resolution', 1, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(10, 'Graph Representations', '# Graph Representations

Learn the two main ways to represent graphs in code.

## Adjacency Matrix

A 2D array where matrix[i][j] indicates an edge from vertex i to j.

```java
class GraphMatrix {
    private int[][] matrix;
    private int vertices;
    
    public GraphMatrix(int v) {
        vertices = v;
        matrix = new int[v][v];
    }
    
    public void addEdge(int src, int dest) {
        matrix[src][dest] = 1;
        matrix[dest][src] = 1; // For undirected
    }
}
```

**Pros**: O(1) edge lookup
**Cons**: O(V²) space

## Adjacency List

An array of lists where each list contains neighbors.

```java
class GraphList {
    private List<List<Integer>> adjList;
    
    public GraphList(int v) {
        adjList = new ArrayList<>();
        for (int i = 0; i < v; i++) {
            adjList.add(new ArrayList<>());
        }
    }
    
    public void addEdge(int src, int dest) {
        adjList.get(src).add(dest);
        adjList.get(dest).add(src);
    }
}
```

**Pros**: O(V + E) space
**Cons**: O(V) edge lookup', 2, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert lessons for Graph Traversals chapter (chapter_id: 11)
INSERT INTO lessons (chapter_id, title, content, lesson_order, duration, created_at, updated_at) VALUES
(11, 'Breadth-First Search (BFS)', '# Breadth-First Search (BFS)

BFS explores all vertices at the current depth before moving to the next level.

## Algorithm

1. Start from a source vertex
2. Visit all neighbors first
3. Then visit neighbors of neighbors
4. Use a queue to track vertices to visit

## Implementation

```java
public void bfs(int start) {
    boolean[] visited = new boolean[V];
    Queue<Integer> queue = new LinkedList<>();
    
    visited[start] = true;
    queue.offer(start);
    
    while (!queue.isEmpty()) {
        int vertex = queue.poll();
        System.out.print(vertex + " ");
        
        for (int neighbor : adjList.get(vertex)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.offer(neighbor);
            }
        }
    }
}
```

## Time Complexity: O(V + E)
## Space Complexity: O(V)

## Applications

- Shortest path in unweighted graphs
- Level-order traversal
- Finding connected components', 1, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(11, 'Depth-First Search (DFS)', '# Depth-First Search (DFS)

DFS explores as far as possible along each branch before backtracking.

## Algorithm

1. Start from a source vertex
2. Go as deep as possible
3. Backtrack when no unvisited neighbors
4. Use recursion or a stack

## Recursive Implementation

```java
public void dfs(int vertex, boolean[] visited) {
    visited[vertex] = true;
    System.out.print(vertex + " ");
    
    for (int neighbor : adjList.get(vertex)) {
        if (!visited[neighbor]) {
            dfs(neighbor, visited);
        }
    }
}
```

## Iterative Implementation

```java
public void dfsIterative(int start) {
    boolean[] visited = new boolean[V];
    Stack<Integer> stack = new Stack<>();
    
    stack.push(start);
    
    while (!stack.isEmpty()) {
        int vertex = stack.pop();
        if (!visited[vertex]) {
            visited[vertex] = true;
            System.out.print(vertex + " ");
            
            for (int neighbor : adjList.get(vertex)) {
                if (!visited[neighbor]) {
                    stack.push(neighbor);
                }
            }
        }
    }
}
```

## Applications

- Cycle detection
- Topological sorting
- Path finding
- Maze solving', 2, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert lessons for Shortest Path Algorithms chapter (chapter_id: 12)
INSERT INTO lessons (chapter_id, title, content, lesson_order, duration, created_at, updated_at) VALUES
(12, 'Dijkstra''s Algorithm', '# Dijkstra''s Algorithm

Find the shortest path from a source to all other vertices in a weighted graph with non-negative edges.

## Algorithm

1. Initialize distances: source = 0, others = infinity
2. Use a priority queue to always process the minimum distance vertex
3. For each neighbor, update distance if a shorter path is found

## Implementation

```java
public int[] dijkstra(int src) {
    int[] dist = new int[V];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
    pq.offer(new int[]{src, 0});
    
    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int u = curr[0];
        
        for (int[] edge : adjList.get(u)) {
            int v = edge[0], weight = edge[1];
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.offer(new int[]{v, dist[v]});
            }
        }
    }
    return dist;
}
```

## Time Complexity: O((V + E) log V)
## Space Complexity: O(V)

## Limitations

- Does not work with negative edge weights
- Use Bellman-Ford for graphs with negative edges', 1, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(12, 'Bellman-Ford Algorithm', '# Bellman-Ford Algorithm

Find shortest paths from a source vertex, even with negative edge weights.

## Algorithm

1. Initialize distances: source = 0, others = infinity
2. Relax all edges V-1 times
3. Check for negative cycles

## Implementation

```java
public int[] bellmanFord(int src, int[][] edges) {
    int[] dist = new int[V];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    
    // Relax edges V-1 times
    for (int i = 0; i < V - 1; i++) {
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            if (dist[u] != Integer.MAX_VALUE && 
                dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    
    // Check for negative cycles
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1], w = edge[2];
        if (dist[u] != Integer.MAX_VALUE && 
            dist[u] + w < dist[v]) {
            throw new RuntimeException("Negative cycle detected");
        }
    }
    
    return dist;
}
```

## Time Complexity: O(V * E)
## Space Complexity: O(V)

## When to Use

- Graphs with negative edge weights
- Detecting negative cycles
- When Dijkstra cannot be applied', 2, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert lessons for 1D Dynamic Programming chapter (chapter_id: 13)
INSERT INTO lessons (chapter_id, title, content, lesson_order, duration, created_at, updated_at) VALUES
(13, 'Introduction to Dynamic Programming', '# Introduction to Dynamic Programming

Dynamic Programming (DP) is an optimization technique that solves complex problems by breaking them into simpler subproblems.

## Key Concepts

### Overlapping Subproblems
The same subproblems are solved multiple times.

### Optimal Substructure
The optimal solution contains optimal solutions to subproblems.

## Approaches

### Top-Down (Memoization)
```java
int[] memo = new int[n + 1];
Arrays.fill(memo, -1);

int fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fib(n - 1) + fib(n - 2);
}
```

### Bottom-Up (Tabulation)
```java
int fib(int n) {
    int[] dp = new int[n + 1];
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
```

## When to Use DP

- Problem has overlapping subproblems
- Problem has optimal substructure
- You need to find optimal (min/max) solution', 1, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(13, 'Climbing Stairs Problem', '# Climbing Stairs Problem

You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. How many distinct ways can you reach the top?

## Analysis

- To reach step n, you can come from step n-1 or n-2
- ways(n) = ways(n-1) + ways(n-2)
- This is the Fibonacci sequence!

## Solution

```java
public int climbStairs(int n) {
    if (n <= 2) return n;
    
    int[] dp = new int[n + 1];
    dp[1] = 1;
    dp[2] = 2;
    
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}
```

## Space Optimized

```java
public int climbStairs(int n) {
    if (n <= 2) return n;
    
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}
```

## Time: O(n), Space: O(1)', 2, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert lessons for 2D Dynamic Programming chapter (chapter_id: 14)
INSERT INTO lessons (chapter_id, title, content, lesson_order, duration, created_at, updated_at) VALUES
(14, 'Grid Path Problems', '# Grid Path Problems

Find the number of unique paths or minimum cost paths in a grid.

## Unique Paths

Count paths from top-left to bottom-right, moving only right or down.

```java
public int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];
    
    // First row and column have only 1 path
    for (int i = 0; i < m; i++) dp[i][0] = 1;
    for (int j = 0; j < n; j++) dp[0][j] = 1;
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}
```

## Minimum Path Sum

Find the path with minimum sum from top-left to bottom-right.

```java
public int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[][] dp = new int[m][n];
    
    dp[0][0] = grid[0][0];
    
    for (int i = 1; i < m; i++) 
        dp[i][0] = dp[i-1][0] + grid[i][0];
    for (int j = 1; j < n; j++) 
        dp[0][j] = dp[0][j-1] + grid[0][j];
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
        }
    }
    
    return dp[m-1][n-1];
}
```', 1, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(14, 'Longest Common Subsequence', '# Longest Common Subsequence (LCS)

Find the longest subsequence common to two sequences.

## Problem

Given two strings, find the length of their longest common subsequence.

Example: "ABCDGH" and "AEDFHR" → LCS is "ADH" (length 3)

## Recurrence

```
if (s1[i] == s2[j])
    dp[i][j] = 1 + dp[i-1][j-1]
else
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
```

## Implementation

```java
public int longestCommonSubsequence(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i-1) == s2.charAt(j-1)) {
                dp[i][j] = 1 + dp[i-1][j-1];
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    
    return dp[m][n];
}
```

## Time: O(m * n)
## Space: O(m * n), can be optimized to O(min(m, n))', 2, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert lessons for Advanced DP Patterns chapter (chapter_id: 15)
INSERT INTO lessons (chapter_id, title, content, lesson_order, duration, created_at, updated_at) VALUES
(15, 'Knapsack Problems', '# Knapsack Problems

Classic optimization problems in dynamic programming.

## 0/1 Knapsack

Given weights and values of n items, find the maximum value that can fit in a knapsack of capacity W.

```java
public int knapsack(int[] weights, int[] values, int W) {
    int n = weights.length;
    int[][] dp = new int[n + 1][W + 1];
    
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            // Don''t take item i
            dp[i][w] = dp[i-1][w];
            
            // Take item i if possible
            if (weights[i-1] <= w) {
                dp[i][w] = Math.max(dp[i][w], 
                    values[i-1] + dp[i-1][w - weights[i-1]]);
            }
        }
    }
    
    return dp[n][W];
}
```

## Unbounded Knapsack

Each item can be used unlimited times.

```java
public int unboundedKnapsack(int[] weights, int[] values, int W) {
    int[] dp = new int[W + 1];
    
    for (int w = 1; w <= W; w++) {
        for (int i = 0; i < weights.length; i++) {
            if (weights[i] <= w) {
                dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
            }
        }
    }
    
    return dp[W];
}
```

## Time: O(n * W)
## Space: O(n * W) or O(W) for space-optimized', 1, 35, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(15, 'State Compression DP', '# State Compression DP

Use bitmasks to represent states in DP problems.

## Concept

When dealing with subsets or combinations, use integers as bitmasks to represent states efficiently.

## Traveling Salesman Problem (TSP)

Find the shortest route visiting all cities exactly once.

```java
public int tsp(int[][] dist) {
    int n = dist.length;
    int[][] dp = new int[1 << n][n];
    
    for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE);
    dp[1][0] = 0; // Start at city 0
    
    for (int mask = 1; mask < (1 << n); mask++) {
        for (int last = 0; last < n; last++) {
            if ((mask & (1 << last)) == 0) continue;
            if (dp[mask][last] == Integer.MAX_VALUE) continue;
            
            for (int next = 0; next < n; next++) {
                if ((mask & (1 << next)) != 0) continue;
                
                int newMask = mask | (1 << next);
                dp[newMask][next] = Math.min(
                    dp[newMask][next],
                    dp[mask][last] + dist[last][next]
                );
            }
        }
    }
    
    int fullMask = (1 << n) - 1;
    int ans = Integer.MAX_VALUE;
    for (int i = 0; i < n; i++) {
        if (dp[fullMask][i] != Integer.MAX_VALUE) {
            ans = Math.min(ans, dp[fullMask][i] + dist[i][0]);
        }
    }
    
    return ans;
}
```

## Time: O(n² * 2^n)
## Space: O(n * 2^n)

## When to Use

- Problems involving subsets (n ≤ 20)
- Permutation problems
- Assignment problems', 2, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Award some badges to demo user
INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES
(1, 1, CURRENT_TIMESTAMP),
(1, 2, CURRENT_TIMESTAMP);
