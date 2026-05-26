# JavaScript — Objects, Arrays & Math | Interview-Ready Notes

---

## 1. Object Literals

An **object literal** is the most fundamental data structure in JS — a collection of key-value pairs stored in memory as a hash map.

```js
const student = {
    name: "vishal",
    age: 23,
    marks: 94.5
};
```

**Console Output:**
```
{ name: 'vishal', age: 23, marks: 94.5 }
```

### 🎯 Interview Angle

> **Q: What is the difference between `const` object and a truly immutable object?**

`const` only prevents **reassignment** of the variable binding — it does **not** make the object immutable. You can still mutate its properties.

```js
const student = { name: "vishal" };
student.name = "nishad";   // ✅ works fine
student = {};              // ❌ TypeError: Assignment to constant variable
```

**Production insight:** In real apps (React state, Redux), you avoid direct mutation to preserve referential equality for re-render optimisation. Use `Object.freeze()` for true immutability or spread operator `{ ...obj, key: newVal }` for immutable updates.

---

## 2. Arrays as Ordered Collections

```js
let student2 = ["vishal", 23, 94.5];
```

**Console Output:**
```
[ 'vishal', 23, 94.5 ]
```

### 🎯 Interview Angle

> **Q: When do you prefer an Array over an Object?**

| Scenario | Use |
|---|---|
| Ordered list, index-based access | **Array** |
| Named properties, key-based lookup | **Object** |
| Iteration with `.map()`, `.filter()` | **Array** |
| Config, settings, entity data | **Object** |

**Production insight:** A mixed-type array like `["vishal", 23, 94.5]` is valid JS but bad practice for production — it kills type safety. In TypeScript (used in most product companies), you'd type this as a `tuple: [string, number, number]` or better, use an object.

---

## 3. Nested Values — Objects with Arrays

```js
const item = {
    price: 100.99,
    discount: 50,
    colors: ["red", "pink"]
};
```

**Console Output:**
```
{ price: 100.99, discount: 50, colors: [ 'red', 'pink' ] }
```

### 🎯 Interview Angle

> **Q: How do you access and update a nested array inside an object?**

```js
item.colors.push("blue");     // mutates in place
item.colors[0] = "orange";    // direct index update

// Immutable pattern (preferred in React):
const updatedItem = { ...item, colors: [...item.colors, "blue"] };
```

**Production insight:** E-commerce platforms (Flipkart, Amazon) model products exactly like this — `price`, `discount`, and `variants/colors` as arrays. Knowing how to update them immutably is critical for React/Redux interviews.

---

## 4. Social Media Post Object

```js
const post = {
    username: "@vishal123",
    content: "This is my @firstpost",
    likes: 150,
    reposts: 5,
    tags: ["@first", "newjoined"]
};
```

### 🎯 Interview Angle

> **Q: Model a Twitter/X post — what fields would you include?**

This is a classic system design mini-question. A production post entity would look like:

```js
const post = {
    id: "uuid-xxxx",               // unique identifier
    userId: "user-123",            // foreign key, not username
    content: "This is my @firstpost",
    likes: 150,
    reposts: 5,
    tags: ["#first", "#newjoined"],
    createdAt: new Date().toISOString(),
    isDeleted: false               // soft delete pattern
};
```

**Production insight:** Never store `username` in the post — store `userId` (foreign key). This prevents data inconsistency when a user renames their handle. This is a normalization principle, and interviewers at product companies love this answer.

---

## 5. Object Key Coercion — Keys Are Always Strings (or Symbols)

```js
const example = {
    1: "a",
    2: "b",
    null: "c",
    true: "d",
    undefined: "e"
};
```

**Console Output:**
```
{ '1': 'a', '2': 'b', null: 'c', true: 'd', undefined: 'e' }
```

JS **automatically coerces** all object keys to strings (except Symbols).

### 🎯 Interview Angle

> **Q: What happens when you use a number as an object key? What's the difference between an object and a Map?**

```js
console.log(example[1]);      // "a"  → JS converts 1 → "1" internally
console.log(example["1"]);    // "a"  → same result
```

**Production insight:** When you need keys that are **non-string** (numbers, objects) or need to **preserve insertion order** reliably, use a `Map`:

```js
const map = new Map();
map.set(1, "a");         // key stays as Number 1, not "1"
map.set(null, "c");
map.get(1);              // "a"
```

`Map` is used heavily in caching layers and graph/adjacency-list implementations in interviews.

---

## 6. Dynamic Property Access — Bracket Notation, Add, Delete

```js
student["name"] = "nishad";     // update existing
student["gender"] = "male";     // add new property
student["marks"] = [4, 5, 2];   // reassign with new type

console.log(student);
// { name: 'nishad', age: 23, marks: [ 4, 5, 2 ], gender: 'male' }

delete student.marks;
console.log(student);
// { name: 'nishad', age: 23, gender: 'male' }
```

### 🎯 Interview Angle

> **Q: When do you use dot notation vs bracket notation?**

| Notation | When to use |
|---|---|
| `obj.key` | Key is a known, valid identifier |
| `obj["key"]` | Key is dynamic, has spaces, or comes from a variable |

```js
// Real scenario: dynamic key from API response
const field = "name";
console.log(student[field]);    // "nishad" ✅
console.log(student.field);    // undefined ❌ (looks for literal "field")
```

> **Q: What's the difference between `delete obj.key` and setting it to `undefined`?**

```js
student.marks = undefined;   // key still EXISTS, value is undefined
delete student.marks;        // key is REMOVED entirely

"marks" in student;          // false after delete, true after = undefined
```

**Production insight:** `delete` is O(1) but can cause **hidden class deoptimisation** in V8 (Node.js engine). In performance-critical code, prefer setting to `null` or `undefined` rather than deleting — this is a senior-level V8 optimisation fact that impresses interviewers.

---

## 7. Object of Objects (Nested / Hash Map Pattern)

```js
const classInfo = {
    vishal: { grade: "A+", city: "delhi" },
    ravi:   { grade: "B",  city: "mumbai" },
    karan:  { grade: "C",  city: "Lucknow" }
};

classInfo["vishal"]["city"] = "gurgaon";

console.log(classInfo.vishal.grade);   // "A+"
```

**Console Output after mutation:**
```
{
  vishal: { grade: 'A+', city: 'gurgaon' },
  ravi:   { grade: 'B',  city: 'mumbai' },
  karan:  { grade: 'C',  city: 'Lucknow' }
}
```

### 🎯 Interview Angle

> **Q: This looks like a hash map. How would you use this pattern to solve a real problem?**

**Classic interview problem:** Group students by grade.

```js
// Build a grade → [students] map from classInfo
const gradeMap = {};

for (let student in classInfo) {
    const grade = classInfo[student].grade;
    if (!gradeMap[grade]) gradeMap[grade] = [];
    gradeMap[grade].push(student);
}

console.log(gradeMap);
// { 'A+': [ 'vishal' ], B: [ 'ravi' ], C: [ 'karan' ] }
```

**Production insight:** This "object-as-hashmap" pattern is used in frequency counters, caching (`memoization`), and lookup tables — all patterns you'll encounter in DSA rounds at product companies.

---

## 8. Array of Objects — The Most Common Data Pattern

```js
const classInfoArr = [
    { name: "vishal", grade: "A", city: "delhi" },
    { name: "deepak", grade: "B", city: "Patna" }
];

classInfoArr[0]["gender"] = "male";

console.log(classInfoArr[0]["name"]);   // "vishal"
```

**Console Output:**
```
[
  { name: 'vishal', grade: 'A', city: 'delhi', gender: 'male' },
  { name: 'deepak', grade: 'B', city: 'Patna' }
]
```

### 🎯 Interview Angle

> **Q: How do you find, filter, and transform an array of objects — the way you would in a real API response?**

This is the **most asked** JS question category in product company rounds.

```js
// Filter: students with grade "A"
const topStudents = classInfoArr.filter(s => s.grade === "A");

// Find: first student from delhi
const delhiStudent = classInfoArr.find(s => s.city === "delhi");

// Map: extract only names
const names = classInfoArr.map(s => s.name);  // ["vishal", "deepak"]

// Sort: alphabetically by name
const sorted = [...classInfoArr].sort((a, b) => a.name.localeCompare(b.name));

// Reduce: build a name → grade lookup
const lookup = classInfoArr.reduce((acc, s) => {
    acc[s.name] = s.grade;
    return acc;
}, {});
// { vishal: 'A', deepak: 'B' }
```

**Production insight:** Every REST API returns `Array<Object>`. Knowing `.map()`, `.filter()`, `.find()`, `.reduce()`, `.sort()` on arrays of objects is **non-negotiable** for frontend and backend JS roles.

---

## 9. The Math Object — Built-in Utility

```js
console.log(Math.pow(2, 3));      // 8
console.log(Math.floor(5.54444)); // 5
console.log(Math.abs(-12.3));     // 12.3
console.log(Math.random());       // e.g. 0.7342190234 (0 ≤ n < 1)
```

### Key Math Methods Cheatsheet

| Method | What it does | Example |
|---|---|---|
| `Math.pow(x, y)` | x to the power y | `Math.pow(2,10)` → `1024` |
| `Math.floor(n)` | Round **down** | `Math.floor(4.9)` → `4` |
| `Math.ceil(n)` | Round **up** | `Math.ceil(4.1)` → `5` |
| `Math.round(n)` | Round to nearest | `Math.round(4.5)` → `5` |
| `Math.abs(n)` | Absolute value | `Math.abs(-7)` → `7` |
| `Math.max(...arr)` | Largest value | `Math.max(1,5,3)` → `5` |
| `Math.min(...arr)` | Smallest value | `Math.min(1,5,3)` → `1` |
| `Math.sqrt(n)` | Square root | `Math.sqrt(16)` → `4` |
| `Math.random()` | Random `[0, 1)` | `0.482...` |

---

## 10. Generating Random Integers — The Pattern

```js
let num = Math.random();      // 0.0 – 0.9999...
num = Math.floor(num * 100);  // 0 – 99
console.log(num + 1);         // 1 – 100
```

### The Universal Formula

To generate a random integer between `min` and `max` (inclusive):

```js
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(randomInt(1, 6));    // Dice: 1–6
console.log(randomInt(20, 24)); // From the code: 20–24
console.log(randomInt(1, 100)); // 1–100
```

**Console Output examples:**
```
4
22
73
```

### 🎯 Interview Angle

> **Q: Generate a random number in range [20, 24]. Explain why your formula works.**

```js
Math.floor(Math.random() * 5) + 20
//         ↑ gives 0–4          ↑ shifts range to 20–24
```

- `Math.random()` → `[0, 1)` exclusive
- `* 5` → `[0, 5)` exclusive
- `Math.floor()` → `{0, 1, 2, 3, 4}`
- `+ 20` → `{20, 21, 22, 23, 24}` ✅

> **Q: Simulate a 6-sided dice roll.**

```js
const dice = Math.floor(Math.random() * 6) + 1;
// Math.floor(Math.random() * 6) gives {0,1,2,3,4,5}
// + 1 shifts to {1,2,3,4,5,6}
```

**Production insight:** Cryptographically secure random numbers (for tokens, OTPs, game seeds) should use `crypto.getRandomValues()` in the browser or Node's `crypto` module — **never** `Math.random()`. This is asked in security-conscious product company interviews.

```js
// Secure random integer 1–6 (Node.js)
const { randomInt } = require("crypto");
console.log(randomInt(1, 7));  // [1, 7) → {1,2,3,4,5,6}
```

---

## ⚡ Quick Revision — Key Concepts Map

| Concept | Key Takeaway | Interview Trap |
|---|---|---|
| `const` object | Binding is const, not values | Can still mutate properties |
| Object keys | Always coerced to strings | `obj[1]` === `obj["1"]` |
| Dot vs Bracket | Dot for static, bracket for dynamic | `obj.field` ≠ `obj[field]` |
| `delete` vs `= undefined` | `delete` removes key, `undefined` keeps it | `"key" in obj` behaves differently |
| Array of objects | Core pattern for API data | Master `.map()` `.filter()` `.reduce()` |
| `Math.random()` range | `Math.floor(Math.random() * n) + min` | `Math.random()` is NOT cryptographically secure |

---

## 🏭 Production Patterns to Remember

1. **Immutable updates** — spread instead of mutating: `{ ...obj, key: newVal }`
2. **Normalise data** — store IDs as foreign keys, not full objects
3. **Use `Map`** when keys are non-string or order/size matters
4. **Use `crypto.randomInt`** for security-sensitive randomness
5. **Avoid mixed-type arrays** — use TypeScript tuples or objects instead
6. **`Object.freeze()`** for config constants that must never change

