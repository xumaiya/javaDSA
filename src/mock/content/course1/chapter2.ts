// Course 1 - Chapter 2: Trees
// 3 lessons: Binary Trees, BST, Tree Traversals

export const chapter2Lessons = {
  'lesson-chapter-1-2-1': `# Binary Trees Basics

## What is a Binary Tree?

A **binary tree** is like a family tree! Each person (node) can have at most **two children** - a left child and a right child.

## Tree Terminology

- **Root**: The topmost node (like the grandparent)
- **Parent**: Node with children
- **Child**: Node connected below another node
- **Leaf**: Node with no children
- **Height**: Longest path from root to leaf
- **Depth**: Distance from root to a node

## Binary Tree Structure

\`\`\`
        1
       / \\
      2   3
     / \\
    4   5
\`\`\`

- Root: 1
- Leaves: 4, 5, 3
- Height: 2

## Binary Tree Implementation

\`\`\`java
class TreeNode {
    int data;
    TreeNode left;
    TreeNode right;
    
    TreeNode(int data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

public class BinaryTree {
    TreeNode root;
    
    public BinaryTree() {
        root = null;
    }
    
    // Create a sample tree
    public void createSampleTree() {
        root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.left.left = new TreeNode(4);
        root.left.right = new TreeNode(5);
    }
}
\`\`\`

## Types of Binary Trees

### 1. Full Binary Tree
Every node has 0 or 2 children (no node has only 1 child)

\`\`\`
        1
       / \\
      2   3
     / \\
    4   5
\`\`\`

### 2. Complete Binary Tree
All levels are filled except possibly the last, which is filled from left to right

\`\`\`
        1
       / \\
      2   3
     / \\
    4   5
\`\`\`

### 3. Perfect Binary Tree
All internal nodes have 2 children and all leaves are at the same level

\`\`\`
        1
       / \\
      2   3
     / \\ / \\
    4  5 6  7
\`\`\`

## Basic Tree Operations

### Count Nodes

\`\`\`java
public int countNodes(TreeNode root) {
    if (root == null) {
        return 0;
    }
    return 1 + countNodes(root.left) + countNodes(root.right);
}
\`\`\`

### Find Height

\`\`\`java
public int height(TreeNode root) {
    if (root == null) {
        return 0;
    }
    
    int leftHeight = height(root.left);
    int rightHeight = height(root.right);
    
    return 1 + Math.max(leftHeight, rightHeight);
}
\`\`\`

### Find Maximum Value

\`\`\`java
public int findMax(TreeNode root) {
    if (root == null) {
        return Integer.MIN_VALUE;
    }
    
    int max = root.data;
    int leftMax = findMax(root.left);
    int rightMax = findMax(root.right);
    
    return Math.max(max, Math.max(leftMax, rightMax));
}
\`\`\`

### Check if Two Trees are Identical

\`\`\`java
public boolean areIdentical(TreeNode root1, TreeNode root2) {
    if (root1 == null && root2 == null) {
        return true;
    }
    
    if (root1 == null || root2 == null) {
        return false;
    }
    
    return (root1.data == root2.data) &&
           areIdentical(root1.left, root2.left) &&
           areIdentical(root1.right, root2.right);
}
\`\`\`

[Open Code Editor](/editor)

## Key Takeaways

✅ Binary tree: each node has at most 2 children
✅ Root is the topmost node
✅ Leaves are nodes with no children
✅ Height is the longest path from root to leaf
✅ Many operations use recursion
`,

  'lesson-chapter-1-2-2': `# Tree Traversals

## What is Tree Traversal?

**Traversal** means visiting every node in the tree exactly once. There are different ways to do this!

## Three Main Traversals

1. **Inorder** (Left → Root → Right)
2. **Preorder** (Root → Left → Right)
3. **Postorder** (Left → Right → Root)

## Example Tree

\`\`\`
        1
       / \\
      2   3
     / \\
    4   5
\`\`\`

- **Inorder**: 4, 2, 5, 1, 3
- **Preorder**: 1, 2, 4, 5, 3
- **Postorder**: 4, 5, 2, 3, 1

## Inorder Traversal (Left → Root → Right)

\`\`\`java
public void inorder(TreeNode root) {
    if (root == null) {
        return;
    }
    
    inorder(root.left);           // Visit left
    System.out.print(root.data + " ");  // Visit root
    inorder(root.right);          // Visit right
}
\`\`\`

**Use Case**: In Binary Search Trees, inorder gives sorted order!

## Preorder Traversal (Root → Left → Right)

\`\`\`java
public void preorder(TreeNode root) {
    if (root == null) {
        return;
    }
    
    System.out.print(root.data + " ");  // Visit root
    preorder(root.left);                // Visit left
    preorder(root.right);               // Visit right
}
\`\`\`

**Use Case**: Creating a copy of the tree, prefix expression evaluation

## Postorder Traversal (Left → Right → Root)

\`\`\`java
public void postorder(TreeNode root) {
    if (root == null) {
        return;
    }
    
    postorder(root.left);               // Visit left
    postorder(root.right);              // Visit right
    System.out.print(root.data + " ");  // Visit root
}
\`\`\`

**Use Case**: Deleting a tree, postfix expression evaluation

## Level Order Traversal (BFS)

Visit nodes level by level, left to right.

\`\`\`java
import java.util.Queue;
import java.util.LinkedList;

public void levelOrder(TreeNode root) {
    if (root == null) {
        return;
    }
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    
    while (!queue.isEmpty()) {
        TreeNode current = queue.poll();
        System.out.print(current.data + " ");
        
        if (current.left != null) {
            queue.offer(current.left);
        }
        if (current.right != null) {
            queue.offer(current.right);
        }
    }
}
\`\`\`

**Output for example tree**: 1, 2, 3, 4, 5

## Iterative Inorder (Using Stack)

\`\`\`java
import java.util.Stack;

public void inorderIterative(TreeNode root) {
    Stack<TreeNode> stack = new Stack<>();
    TreeNode current = root;
    
    while (current != null || !stack.isEmpty()) {
        // Go to leftmost node
        while (current != null) {
            stack.push(current);
            current = current.left;
        }
        
        // Visit node
        current = stack.pop();
        System.out.print(current.data + " ");
        
        // Go to right subtree
        current = current.right;
    }
}
\`\`\`

## Practical Problems

### Print Leaf Nodes

\`\`\`java
public void printLeaves(TreeNode root) {
    if (root == null) {
        return;
    }
    
    if (root.left == null && root.right == null) {
        System.out.print(root.data + " ");
        return;
    }
    
    printLeaves(root.left);
    printLeaves(root.right);
}
\`\`\`

### Print Nodes at Distance K

\`\`\`java
public void printAtDistanceK(TreeNode root, int k) {
    if (root == null) {
        return;
    }
    
    if (k == 0) {
        System.out.print(root.data + " ");
        return;
    }
    
    printAtDistanceK(root.left, k - 1);
    printAtDistanceK(root.right, k - 1);
}
\`\`\`

## Time & Space Complexity

| Traversal | Time | Space (Recursion) |
|-----------|------|-------------------|
| Inorder | O(n) | O(h) |
| Preorder | O(n) | O(h) |
| Postorder | O(n) | O(h) |
| Level Order | O(n) | O(w) |

where h = height, w = max width

[Open Code Editor](/editor)

## Key Takeaways

✅ Inorder: Left → Root → Right (gives sorted order in BST)
✅ Preorder: Root → Left → Right (used for copying tree)
✅ Postorder: Left → Right → Root (used for deleting tree)
✅ Level Order: Uses queue (BFS)
✅ All traversals visit each node exactly once
`,

  'lesson-chapter-1-2-3': `# Binary Search Trees (BST)

## What is a BST?

A **Binary Search Tree** is a special binary tree where:
- **Left subtree** contains only nodes with values **less than** the parent
- **Right subtree** contains only nodes with values **greater than** the parent
- Both left and right subtrees are also BSTs

## BST Example

\`\`\`
        50
       /  \\
      30   70
     / \\   / \\
    20 40 60 80
\`\`\`

✅ All values in left subtree < 50
✅ All values in right subtree > 50

## BST Implementation

\`\`\`java
class TreeNode {
    int data;
    TreeNode left;
    TreeNode right;
    
    TreeNode(int data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

public class BST {
    TreeNode root;
    
    public BST() {
        root = null;
    }
    
    // Insert a value
    public void insert(int value) {
        root = insertRec(root, value);
    }
    
    private TreeNode insertRec(TreeNode root, int value) {
        if (root == null) {
            return new TreeNode(value);
        }
        
        if (value < root.data) {
            root.left = insertRec(root.left, value);
        } else if (value > root.data) {
            root.right = insertRec(root.right, value);
        }
        
        return root;
    }
    
    // Search for a value
    public boolean search(int value) {
        return searchRec(root, value);
    }
    
    private boolean searchRec(TreeNode root, int value) {
        if (root == null) {
            return false;
        }
        
        if (root.data == value) {
            return true;
        }
        
        if (value < root.data) {
            return searchRec(root.left, value);
        } else {
            return searchRec(root.right, value);
        }
    }
    
    // Delete a value
    public void delete(int value) {
        root = deleteRec(root, value);
    }
    
    private TreeNode deleteRec(TreeNode root, int value) {
        if (root == null) {
            return null;
        }
        
        if (value < root.data) {
            root.left = deleteRec(root.left, value);
        } else if (value > root.data) {
            root.right = deleteRec(root.right, value);
        } else {
            // Node to be deleted found
            
            // Case 1: No children (leaf node)
            if (root.left == null && root.right == null) {
                return null;
            }
            
            // Case 2: One child
            if (root.left == null) {
                return root.right;
            }
            if (root.right == null) {
                return root.left;
            }
            
            // Case 3: Two children
            // Find inorder successor (smallest in right subtree)
            root.data = findMin(root.right);
            root.right = deleteRec(root.right, root.data);
        }
        
        return root;
    }
    
    private int findMin(TreeNode root) {
        while (root.left != null) {
            root = root.left;
        }
        return root.data;
    }
}
\`\`\`

## BST Operations

### Find Minimum

\`\`\`java
public int findMin() {
    if (root == null) {
        throw new IllegalStateException("Tree is empty");
    }
    
    TreeNode current = root;
    while (current.left != null) {
        current = current.left;
    }
    return current.data;
}
\`\`\`

### Find Maximum

\`\`\`java
public int findMax() {
    if (root == null) {
        throw new IllegalStateException("Tree is empty");
    }
    
    TreeNode current = root;
    while (current.right != null) {
        current = current.right;
    }
    return current.data;
}
\`\`\`

### Check if Valid BST

\`\`\`java
public boolean isValidBST() {
    return isValidBSTRec(root, Integer.MIN_VALUE, Integer.MAX_VALUE);
}

private boolean isValidBSTRec(TreeNode root, int min, int max) {
    if (root == null) {
        return true;
    }
    
    if (root.data <= min || root.data >= max) {
        return false;
    }
    
    return isValidBSTRec(root.left, min, root.data) &&
           isValidBSTRec(root.right, root.data, max);
}
\`\`\`

### Find Kth Smallest Element

\`\`\`java
private int count = 0;
private int result = -1;

public int kthSmallest(TreeNode root, int k) {
    count = 0;
    result = -1;
    inorderKth(root, k);
    return result;
}

private void inorderKth(TreeNode root, int k) {
    if (root == null) {
        return;
    }
    
    inorderKth(root.left, k);
    
    count++;
    if (count == k) {
        result = root.data;
        return;
    }
    
    inorderKth(root.right, k);
}
\`\`\`

## Time Complexity

| Operation | Average | Worst Case |
|-----------|---------|------------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |

**Note**: Worst case O(n) happens when tree becomes skewed (like a linked list)

## BST vs Array

| Feature | BST | Sorted Array |
|---------|-----|--------------|
| Search | O(log n) | O(log n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
| Sorted Order | Inorder traversal | Already sorted |

[Open Code Editor](/editor)

## Key Takeaways

✅ BST maintains sorted order: left < root < right
✅ Inorder traversal gives sorted sequence
✅ Average O(log n) for search, insert, delete
✅ Can degrade to O(n) if tree becomes skewed
✅ Self-balancing BSTs (AVL, Red-Black) prevent skewing
`,
};
