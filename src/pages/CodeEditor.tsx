import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Terminal,
  Code2,
  Loader2,
  AlertCircle,
  ChevronDown,
  Download,
  Trash2,
  Save,
  FileCode,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

// Code templates for different DSA topics
const CODE_TEMPLATES: Record<string, { name: string; code: string }> = {
  empty: {
    name: 'Empty Template',
    code: `public class Main {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello, DSA!");
    }
}`,
  },
  array: {
    name: 'Array Operations',
    code: `public class Main {
    public static void main(String[] args) {
        // Creating an array
        int[] numbers = {5, 2, 8, 1, 9, 3};
        
        // Print array
        System.out.println("Array elements:");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
        
        // Find maximum
        int max = numbers[0];
        for (int i = 1; i < numbers.length; i++) {
            if (numbers[i] > max) {
                max = numbers[i];
            }
        }
        System.out.println("Maximum: " + max);
        
        // Find sum
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        System.out.println("Sum: " + sum);
    }
}`,
  },
  linkedlist: {
    name: 'Linked List',
    code: `class Node {
    int data;
    Node next;
    
    Node(int data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    Node head;
    
    // Add at end
    void append(int data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
            return;
        }
        Node current = head;
        while (current.next != null) {
            current = current.next;
        }
        current.next = newNode;
    }
    
    // Print list
    void printList() {
        Node current = head;
        while (current != null) {
            System.out.print(current.data + " -> ");
            current = current.next;
        }
        System.out.println("null");
    }
}

public class Main {
    public static void main(String[] args) {
        LinkedList list = new LinkedList();
        list.append(1);
        list.append(2);
        list.append(3);
        list.append(4);
        
        System.out.println("Linked List:");
        list.printList();
    }
}`,
  },
  stack: {
    name: 'Stack Implementation',
    code: `import java.util.ArrayList;

class Stack {
    private ArrayList<Integer> items = new ArrayList<>();
    
    // Push element
    void push(int item) {
        items.add(item);
        System.out.println("Pushed: " + item);
    }
    
    // Pop element
    int pop() {
        if (isEmpty()) {
            System.out.println("Stack is empty!");
            return -1;
        }
        int item = items.remove(items.size() - 1);
        System.out.println("Popped: " + item);
        return item;
    }
    
    // Peek top element
    int peek() {
        if (isEmpty()) {
            return -1;
        }
        return items.get(items.size() - 1);
    }
    
    boolean isEmpty() {
        return items.isEmpty();
    }
    
    int size() {
        return items.size();
    }
}

public class Main {
    public static void main(String[] args) {
        Stack stack = new Stack();
        
        stack.push(10);
        stack.push(20);
        stack.push(30);
        
        System.out.println("Top element: " + stack.peek());
        System.out.println("Stack size: " + stack.size());
        
        stack.pop();
        stack.pop();
        
        System.out.println("After popping, top: " + stack.peek());
    }
}`,
  },
  queue: {
    name: 'Queue Implementation',
    code: `import java.util.ArrayList;

class Queue {
    private ArrayList<Integer> items = new ArrayList<>();
    
    // Enqueue - add to back
    void enqueue(int item) {
        items.add(item);
        System.out.println("Enqueued: " + item);
    }
    
    // Dequeue - remove from front
    int dequeue() {
        if (isEmpty()) {
            System.out.println("Queue is empty!");
            return -1;
        }
        int item = items.remove(0);
        System.out.println("Dequeued: " + item);
        return item;
    }
    
    // Peek front element
    int peek() {
        if (isEmpty()) {
            return -1;
        }
        return items.get(0);
    }
    
    boolean isEmpty() {
        return items.isEmpty();
    }
    
    int size() {
        return items.size();
    }
}

public class Main {
    public static void main(String[] args) {
        Queue queue = new Queue();
        
        queue.enqueue(10);
        queue.enqueue(20);
        queue.enqueue(30);
        
        System.out.println("Front element: " + queue.peek());
        System.out.println("Queue size: " + queue.size());
        
        queue.dequeue();
        queue.dequeue();
        
        System.out.println("After dequeuing, front: " + queue.peek());
    }
}`,
  },
  binarytree: {
    name: 'Binary Tree',
    code: `class TreeNode {
    int data;
    TreeNode left, right;
    
    TreeNode(int data) {
        this.data = data;
        left = right = null;
    }
}

class BinaryTree {
    TreeNode root;
    
    // Inorder traversal (Left, Root, Right)
    void inorder(TreeNode node) {
        if (node != null) {
            inorder(node.left);
            System.out.print(node.data + " ");
            inorder(node.right);
        }
    }
    
    // Preorder traversal (Root, Left, Right)
    void preorder(TreeNode node) {
        if (node != null) {
            System.out.print(node.data + " ");
            preorder(node.left);
            preorder(node.right);
        }
    }
    
    // Postorder traversal (Left, Right, Root)
    void postorder(TreeNode node) {
        if (node != null) {
            postorder(node.left);
            postorder(node.right);
            System.out.print(node.data + " ");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        BinaryTree tree = new BinaryTree();
        
        //       1
        //      / \\
        //     2   3
        //    / \\
        //   4   5
        
        tree.root = new TreeNode(1);
        tree.root.left = new TreeNode(2);
        tree.root.right = new TreeNode(3);
        tree.root.left.left = new TreeNode(4);
        tree.root.left.right = new TreeNode(5);
        
        System.out.println("Inorder traversal:");
        tree.inorder(tree.root);
        
        System.out.println("\\n\\nPreorder traversal:");
        tree.preorder(tree.root);
        
        System.out.println("\\n\\nPostorder traversal:");
        tree.postorder(tree.root);
    }
}`,
  },
  bubblesort: {
    name: 'Bubble Sort',
    code: `public class Main {
    // Bubble Sort Algorithm
    static void bubbleSort(int[] arr) {
        int n = arr.length;
        
        for (int i = 0; i < n - 1; i++) {
            // Flag to optimize if no swaps occur
            boolean swapped = false;
            
            for (int j = 0; j < n - i - 1; j++) {
                // Compare adjacent elements
                if (arr[j] > arr[j + 1]) {
                    // Swap them
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            
            // If no swaps, array is sorted
            if (!swapped) break;
        }
    }
    
    static void printArray(int[] arr) {
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
    
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        
        System.out.println("Original array:");
        printArray(arr);
        
        bubbleSort(arr);
        
        System.out.println("Sorted array:");
        printArray(arr);
    }
}`,
  },
  binarysearch: {
    name: 'Binary Search',
    code: `public class Main {
    // Binary Search Algorithm
    static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            // Check if target is at mid
            if (arr[mid] == target) {
                return mid;
            }
            
            // If target is greater, search right half
            if (arr[mid] < target) {
                left = mid + 1;
            }
            // If target is smaller, search left half
            else {
                right = mid - 1;
            }
        }
        
        // Target not found
        return -1;
    }
    
    public static void main(String[] args) {
        // Array must be sorted for binary search
        int[] arr = {2, 3, 4, 10, 40, 50, 60, 70};
        int target = 10;
        
        System.out.println("Array: ");
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
        
        int result = binarySearch(arr, target);
        
        if (result == -1) {
            System.out.println("Element " + target + " not found");
        } else {
            System.out.println("Element " + target + " found at index " + result);
        }
    }
}`,
  },
};


export const CodeEditor = () => {
  const [code, setCode] = useState(CODE_TEMPLATES.empty.code);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('empty');
  const [showTemplates, setShowTemplates] = useState(false);
  const [savedCodes, setSavedCodes] = useState<Array<{name: string, code: string}>>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved codes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedCodes');
    if (saved) {
      setSavedCodes(JSON.parse(saved));
    }
  }, []);

  // Handle tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      // Set cursor position after tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
    
    // Ctrl+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    
    // Ctrl+Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  };

  // Run code using backend API
  const runCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('Running...');

    try {
      const response = await fetch('http://localhost:8080/api/code/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute code');
      }

      const result = await response.json();
      
      if (result.data.error) {
        setError(result.data.error);
        setOutput('');
      } else {
        const executionTime = result.data.executionTime;
        setOutput(result.data.output + `\n\n--- Executed in ${executionTime}ms ---`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to server');
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTemplateSelect = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    setCode(CODE_TEMPLATES[templateKey].code);
    setShowTemplates(false);
    setOutput('');
    setError(null);
  };

  const handleClear = () => {
    setCode(CODE_TEMPLATES.empty.code);
    setSelectedTemplate('empty');
    setOutput('');
    setError(null);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Main.java';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const name = prompt('Enter a name for this code:');
    if (name) {
      const newSaved = [...savedCodes, { name, code }];
      setSavedCodes(newSaved);
      localStorage.setItem('savedCodes', JSON.stringify(newSaved));
      alert('Code saved successfully!');
    }
  };

  const loadSavedCode = (savedCode: {name: string, code: string}) => {
    setCode(savedCode.code);
    setShowSaved(false);
    setOutput('');
    setError(null);
  };

  const deleteSavedCode = (index: number) => {
    const newSaved = savedCodes.filter((_, i) => i !== index);
    setSavedCodes(newSaved);
    localStorage.setItem('savedCodes', JSON.stringify(newSaved));
  };

  // Line numbers
  const lineCount = code.split('\n').length;

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-olive-dark dark:text-dark-text flex items-center gap-2">
            <Code2 className="h-7 w-7 text-olive dark:text-dark-accent" />
            Java Code Editor
          </h1>
          <p className="text-text-muted dark:text-dark-text-muted text-sm mt-1">
            Write, compile, and run Java code in real-time • Ctrl+Enter to run • Ctrl+S to save
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Font Size Control */}
          <div className="flex items-center gap-1 bg-white dark:bg-dark-surface px-2 py-1 rounded-lg border border-olive-light/30 dark:border-dark-border">
            <button
              onClick={() => setFontSize(Math.max(10, fontSize - 2))}
              className="px-2 py-1 hover:bg-olive-light/30 dark:hover:bg-dark-surface-hover rounded text-sm"
            >
              A-
            </button>
            <span className="text-xs text-text-muted dark:text-dark-text-muted px-1">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="px-2 py-1 hover:bg-olive-light/30 dark:hover:bg-dark-surface-hover rounded text-sm"
            >
              A+
            </button>
          </div>

          {/* Saved Codes */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowSaved(!showSaved)}
              className="gap-2"
            >
              <FileCode className="h-4 w-4" />
              Saved ({savedCodes.length})
            </Button>
            
            {showSaved && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-olive-light/30 dark:border-dark-border z-50 max-h-96 overflow-auto">
                {savedCodes.length === 0 ? (
                  <div className="p-4 text-center text-text-muted dark:text-dark-text-muted text-sm">
                    No saved codes yet
                  </div>
                ) : (
                  savedCodes.map((saved, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3 py-2 hover:bg-olive-light/30 dark:hover:bg-dark-surface-hover border-b border-olive-light/20 dark:border-dark-border last:border-0"
                    >
                      <button
                        onClick={() => loadSavedCode(saved)}
                        className="flex-1 text-left text-sm text-olive-dark dark:text-dark-text truncate"
                      >
                        {saved.name}
                      </button>
                      <button
                        onClick={() => deleteSavedCode(index)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        
          {/* Template Selector */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowTemplates(!showTemplates)}
              className="gap-2"
            >
              <Code2 className="h-4 w-4" />
              {CODE_TEMPLATES[selectedTemplate].name}
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {showTemplates && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-olive-light/30 dark:border-dark-border z-50 overflow-hidden">
                {Object.entries(CODE_TEMPLATES).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => handleTemplateSelect(key)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-olive-light/30 dark:hover:bg-dark-surface-hover transition-colors ${
                      selectedTemplate === key ? 'bg-olive-light/50 dark:bg-dark-surface-hover text-olive-dark dark:text-dark-accent' : 'text-olive-dark dark:text-dark-text'
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Code Editor Panel */}
        <Card className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-olive-light/30 dark:bg-dark-surface border-b border-olive-light/30 dark:border-dark-border">
            <span className="text-sm font-medium text-olive-dark dark:text-dark-text">Main.java</span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleSave}
                className="p-1.5 hover:bg-olive-light/50 dark:hover:bg-dark-surface-hover rounded transition-colors"
                title="Save code (Ctrl+S)"
              >
                <Save className="h-4 w-4 text-text-muted dark:text-dark-text-muted" />
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-olive-light/50 dark:hover:bg-dark-surface-hover rounded transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-text-muted dark:text-dark-text-muted" />}
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 hover:bg-olive-light/50 dark:hover:bg-dark-surface-hover rounded transition-colors"
                title="Download"
              >
                <Download className="h-4 w-4 text-text-muted dark:text-dark-text-muted" />
              </button>
              <button
                onClick={handleClear}
                className="p-1.5 hover:bg-olive-light/50 dark:hover:bg-dark-surface-hover rounded transition-colors"
                title="Clear"
              >
                <Trash2 className="h-4 w-4 text-text-muted dark:text-dark-text-muted" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex overflow-hidden">
            {/* Line Numbers */}
            <div className="w-12 bg-olive-pale/50 dark:bg-dark-bg border-r border-olive-light/30 dark:border-dark-border py-3 text-right pr-2 select-none overflow-hidden">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i} className="text-xs text-text-muted dark:text-dark-text-muted leading-6 font-mono">
                  {i + 1}
                </div>
              ))}
            </div>
            
            {/* Code Input */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 p-3 font-mono bg-white dark:bg-dark-bg text-olive-dark dark:text-dark-text resize-none focus:outline-none leading-6 overflow-auto"
              style={{ fontSize: `${fontSize}px` }}
              spellCheck={false}
              placeholder="Write your Java code here..."
            />
          </div>
        </Card>

        {/* Output Panel */}
        <Card className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
            <span className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Output
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setOutput(''); setError(null); }}
                className="text-gray-400 hover:text-gray-200"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={runCode}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
              >
                {isRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Run
              </Button>
            </div>
          </div>
          
          <CardContent className="flex-1 p-0 bg-gray-900 overflow-auto">
            <pre className="p-4 font-mono text-sm min-h-full">
              {error ? (
                <div className="text-red-400 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              ) : output ? (
                <code className="text-green-400 whitespace-pre-wrap">{output}</code>
              ) : (
                <span className="text-gray-500">Click "Run" to execute your code...</span>
              )}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <div className="mt-4 p-3 bg-olive-pale/50 dark:bg-dark-surface rounded-xl">
        <p className="text-sm text-olive-dark dark:text-dark-text">
          <span className="font-medium">💡 Pro Tips:</span> 
          • Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-dark-bg rounded border border-olive-light/30 dark:border-dark-border text-xs">Ctrl+Enter</kbd> to run code 
          • Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-dark-bg rounded border border-olive-light/30 dark:border-dark-border text-xs">Ctrl+S</kbd> to save 
          • Use <kbd className="px-1.5 py-0.5 bg-white dark:bg-dark-bg rounded border border-olive-light/30 dark:border-dark-border text-xs">Tab</kbd> for indentation 
          • Code compiles and runs in real-time on the server
        </p>
      </div>
    </div>
  );
};
