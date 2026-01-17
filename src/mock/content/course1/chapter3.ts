// Course 1 - Chapter 3: Hash Tables
// 3 lessons: Hash Tables Intro, Hash Functions, Applications

export const chapter3Lessons = {
  'lesson-chapter-1-3-1': `# Hash Tables Introduction

## What is a Hash Table?

Imagine a library where instead of searching through every book, you have a magic system that tells you exactly which shelf a book is on instantly! That's what a **hash table** does - it gives you super-fast lookups!

A hash table stores key-value pairs and can find any value in O(1) time on average.

## Real-Life Example

Think of a **phone book**:
- **Key**: Person's name
- **Value**: Phone number
- Instead of reading every page, you jump directly to the right section!

## How Hash Tables Work

1. **Hash Function**: Converts key into an array index
2. **Array**: Stores the values at those indices
3. **Collision Handling**: Deals with multiple keys mapping to same index

\`\`\`
Key "John" → Hash Function → Index 5 → Store value at array[5]
\`\`\`

## Basic Hash Table in Java

\`\`\`java
import java.util.HashMap;

public class HashTableDemo {
    public static void main(String[] args) {
        // Create a hash table
        HashMap<String, Integer> ages = new HashMap<>();
        
        // Add key-value pairs
        ages.put("Alice", 25);
        ages.put("Bob", 30);
        ages.put("Charlie", 35);
        
        // Get value by key - O(1) time!
        System.out.println("Bob's age: " + ages.get("Bob"));
        
        // Check if key exists
        if (ages.containsKey("Alice")) {
            System.out.println("Alice is in the table!");
        }
        
        // Remove a key
        ages.remove("Charlie");
        
        // Iterate through all entries
        for (String name : ages.keySet()) {
            System.out.println(name + " is " + ages.get(name) + " years old");
        }
    }
}
\`\`\`

## Time Complexity

| Operation | Average | Worst Case |
|-----------|---------|------------|
| Insert    | O(1)    | O(n)       |
| Delete    | O(1)    | O(n)       |
| Search    | O(1)    | O(n)       |

## Common Use Cases

1. **Caching**: Store frequently accessed data
2. **Counting**: Count frequency of elements
3. **Indexing**: Quick lookups by unique identifier
4. **Removing duplicates**: Track seen elements

## Practice Problem: Count Word Frequency

\`\`\`java
public static void countWords(String sentence) {
    HashMap<String, Integer> wordCount = new HashMap<>();
    String[] words = sentence.toLowerCase().split(" ");
    
    for (String word : words) {
        wordCount.put(word, wordCount.getOrDefault(word, 0) + 1);
    }
    
    // Print results
    for (String word : wordCount.keySet()) {
        System.out.println(word + ": " + wordCount.get(word));
    }
}
\`\`\`

[Open Code Editor](/editor)

## Key Takeaways

✅ Hash tables provide O(1) average-case lookups
✅ Use hash function to convert keys to indices
✅ Perfect for counting, caching, and quick lookups
✅ Java's HashMap is the standard implementation
`,

  'lesson-chapter-1-3-2': `# Hash Functions and Collisions

## What is a Hash Function?

A **hash function** is like a magic formula that converts any key into a number (array index). Good hash functions spread keys evenly across the array!

## Properties of Good Hash Functions

1. **Deterministic**: Same key always gives same hash
2. **Uniform Distribution**: Spreads keys evenly
3. **Fast to Compute**: Should be O(1)
4. **Minimize Collisions**: Different keys should rarely hash to same index

## Simple Hash Function Example

\`\`\`java
public class SimpleHash {
    private static final int TABLE_SIZE = 10;
    
    // Simple hash function for strings
    public static int hash(String key) {
        int sum = 0;
        for (char c : key.toCharArray()) {
            sum += c;  // Add ASCII values
        }
        return sum % TABLE_SIZE;  // Keep within array bounds
    }
    
    public static void main(String[] args) {
        System.out.println("Hash of 'cat': " + hash("cat"));
        System.out.println("Hash of 'dog': " + hash("dog"));
        System.out.println("Hash of 'act': " + hash("act"));  // Collision!
    }
}
\`\`\`

**Problem**: "cat" and "act" have same hash! This is a **collision**.

## What are Collisions?

When two different keys hash to the same index, we have a **collision**. We need strategies to handle this!

## Collision Resolution Methods

### Method 1: Chaining (Separate Chaining)

Store multiple elements at same index using a **linked list**!

\`\`\`
Index 0: → null
Index 1: → ["apple", 5] → ["apply", 3] → null
Index 2: → ["cat", 10] → null
Index 3: → null
\`\`\`

\`\`\`java
import java.util.LinkedList;

public class HashTableChaining {
    private static class Entry {
        String key;
        int value;
        
        Entry(String key, int value) {
            this.key = key;
            this.value = value;
        }
    }
    
    private LinkedList<Entry>[] table;
    private int size;
    
    @SuppressWarnings("unchecked")
    public HashTableChaining(int capacity) {
        table = new LinkedList[capacity];
        for (int i = 0; i < capacity; i++) {
            table[i] = new LinkedList<>();
        }
    }
    
    private int hash(String key) {
        return Math.abs(key.hashCode() % table.length);
    }
    
    public void put(String key, int value) {
        int index = hash(key);
        LinkedList<Entry> chain = table[index];
        
        // Update if key exists
        for (Entry entry : chain) {
            if (entry.key.equals(key)) {
                entry.value = value;
                return;
            }
        }
        
        // Add new entry
        chain.add(new Entry(key, value));
        size++;
    }
    
    public Integer get(String key) {
        int index = hash(key);
        LinkedList<Entry> chain = table[index];
        
        for (Entry entry : chain) {
            if (entry.key.equals(key)) {
                return entry.value;
            }
        }
        return null;  // Not found
    }
}
\`\`\`

### Method 2: Open Addressing (Linear Probing)

Store all elements in the array itself. When collision occurs, find next empty slot!

\`\`\`java
public class HashTableLinearProbing {
    private String[] keys;
    private int[] values;
    private int capacity;
    private int size;
    
    public HashTableLinearProbing(int capacity) {
        this.capacity = capacity;
        keys = new String[capacity];
        values = new int[capacity];
    }
    
    private int hash(String key) {
        return Math.abs(key.hashCode() % capacity);
    }
    
    public void put(String key, int value) {
        int index = hash(key);
        
        // Linear probing
        while (keys[index] != null) {
            if (keys[index].equals(key)) {
                values[index] = value;  // Update
                return;
            }
            index = (index + 1) % capacity;  // Next slot
        }
        
        keys[index] = key;
        values[index] = value;
        size++;
    }
    
    public Integer get(String key) {
        int index = hash(key);
        
        while (keys[index] != null) {
            if (keys[index].equals(key)) {
                return values[index];
            }
            index = (index + 1) % capacity;
        }
        return null;  // Not found
    }
}
\`\`\`

## Load Factor

**Load Factor** = Number of entries / Table size

- If load factor > 0.75, hash table should **resize** (rehash)
- Keeps operations close to O(1)

\`\`\`java
// HashMap automatically resizes when load factor exceeds 0.75
HashMap<String, Integer> map = new HashMap<>(16, 0.75f);
// Initial capacity: 16, Load factor: 0.75
\`\`\`

## Comparison

| Method | Pros | Cons |
|--------|------|------|
| Chaining | Simple, no clustering | Extra memory for links |
| Linear Probing | Cache-friendly | Primary clustering |

[Open Code Editor](/editor)

## Key Takeaways

✅ Hash functions convert keys to array indices
✅ Good hash functions minimize collisions
✅ Chaining uses linked lists at each index
✅ Open addressing finds next empty slot
✅ Java's HashMap uses chaining
`,

  'lesson-chapter-1-3-3': `# Hash Table Applications

## Common Problems Solved with Hash Tables

Hash tables are incredibly versatile! Let's explore real-world applications.

## 1. Two Sum Problem

**Problem**: Find two numbers in array that add up to target.

\`\`\`java
public class TwoSum {
    public static int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[] {map.get(complement), i};
            }
            
            map.put(nums[i], i);
        }
        
        return new int[] {-1, -1};  // Not found
    }
    
    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.println("Indices: " + result[0] + ", " + result[1]);
        // Output: Indices: 0, 1 (because 2 + 7 = 9)
    }
}
\`\`\`

**Time**: O(n), **Space**: O(n)

## 2. First Non-Repeating Character

\`\`\`java
public class FirstUnique {
    public static char firstUniqChar(String s) {
        HashMap<Character, Integer> count = new HashMap<>();
        
        // Count frequencies
        for (char c : s.toCharArray()) {
            count.put(c, count.getOrDefault(c, 0) + 1);
        }
        
        // Find first with count 1
        for (char c : s.toCharArray()) {
            if (count.get(c) == 1) {
                return c;
            }
        }
        
        return '_';  // No unique character
    }
    
    public static void main(String[] args) {
        System.out.println(firstUniqChar("leetcode"));  // 'l'
        System.out.println(firstUniqChar("loveleetcode"));  // 'v'
    }
}
\`\`\`

## 3. Group Anagrams

**Problem**: Group words that are anagrams of each other.

\`\`\`java
import java.util.*;

public class GroupAnagrams {
    public static List<List<String>> groupAnagrams(String[] words) {
        HashMap<String, List<String>> map = new HashMap<>();
        
        for (String word : words) {
            // Sort characters to create key
            char[] chars = word.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            
            // Add to group
            if (!map.containsKey(key)) {
                map.put(key, new ArrayList<>());
            }
            map.get(key).add(word);
        }
        
        return new ArrayList<>(map.values());
    }
    
    public static void main(String[] args) {
        String[] words = {"eat", "tea", "tan", "ate", "nat", "bat"};
        System.out.println(groupAnagrams(words));
        // [[eat, tea, ate], [tan, nat], [bat]]
    }
}
\`\`\`

## 4. Contains Duplicate

\`\`\`java
public class ContainsDuplicate {
    public static boolean containsDuplicate(int[] nums) {
        HashSet<Integer> seen = new HashSet<>();
        
        for (int num : nums) {
            if (seen.contains(num)) {
                return true;  // Found duplicate!
            }
            seen.add(num);
        }
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(containsDuplicate(new int[]{1,2,3,1}));  // true
        System.out.println(containsDuplicate(new int[]{1,2,3,4}));  // false
    }
}
\`\`\`

## 5. Longest Consecutive Sequence

**Problem**: Find length of longest consecutive sequence in unsorted array.

\`\`\`java
public class LongestConsecutive {
    public static int longestConsecutive(int[] nums) {
        HashSet<Integer> set = new HashSet<>();
        for (int num : nums) {
            set.add(num);
        }
        
        int longest = 0;
        
        for (int num : set) {
            // Only start counting if it's the beginning of sequence
            if (!set.contains(num - 1)) {
                int current = num;
                int streak = 1;
                
                while (set.contains(current + 1)) {
                    current++;
                    streak++;
                }
                
                longest = Math.max(longest, streak);
            }
        }
        
        return longest;
    }
    
    public static void main(String[] args) {
        int[] nums = {100, 4, 200, 1, 3, 2};
        System.out.println(longestConsecutive(nums));  // 4 (1,2,3,4)
    }
}
\`\`\`

## Real-World Applications

1. **Database Indexing**: Quick record lookups
2. **Caching**: Store frequently accessed data
3. **Symbol Tables**: Compilers use for variable names
4. **Spell Checkers**: Dictionary lookups
5. **Password Verification**: Store hashed passwords

## Interview Tips

✅ Clarify the problem: Ask about duplicates, empty inputs, etc.
✅ Think hash table first for O(1) lookups
✅ Consider HashSet vs HashMap: Set for existence, Map for counting
✅ Watch for edge cases: Empty arrays, single elements

[Open Code Editor](/editor)

## Key Takeaways

✅ Hash tables solve many array/string problems efficiently
✅ Two Sum pattern is very common in interviews
✅ Frequency counting is a classic use case
✅ Master HashSet and HashMap usage
✅ Understand time/space tradeoffs
`,
};
