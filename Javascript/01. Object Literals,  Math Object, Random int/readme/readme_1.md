# 📘 JavaScript — Objects, Arrays & Math
---

## 🧠 What This File Covers

| # | Concept | Interview Weight |
|---|---------|-----------------|
| 1 | Object Literals | ⭐⭐⭐⭐⭐ |
| 2 | Arrays vs Objects | ⭐⭐⭐⭐ |
| 3 | Nested Objects (Object of Objects) | ⭐⭐⭐⭐⭐ |
| 4 | Array of Objects | ⭐⭐⭐⭐⭐ |
| 5 | Dynamic Property Access & Mutation | ⭐⭐⭐⭐⭐ |
| 6 | Key Coercion (Type as Keys) | ⭐⭐⭐ |
| 7 | Math Object | ⭐⭐⭐ |
| 8 | Generating Random Integers | ⭐⭐⭐⭐ |

---

## 1. Object Literal — The Backbone of JS Data

An **object** is a collection of key-value pairs. Keys are always strings (or Symbols) internally.
Think of it as a **real-world entity** modeled in code.

```js
const student = {
    name: "vishal",
    age: 23,
    marks: 94.5
};
```

### 🏭 Production Example — API Response Object

In a real product (e.g., Swiggy, Zomato), every API response is an object:

```js
const userProfile = {
    userId: "u_9821",
    name: "Vishal Sharma",
    email: "vishal@gmail.com",
    isPremium: true,
    address: "Delhi"
};

console.log(userProfile.name);      // "Vishal Sharma"
console.log(userProfile["email"]); // "vishal@gmail.com"
```

### 💬 Interview Q: What is the difference between dot notation and bracket notation?

> **Answer:**
> - **Dot notation** (`obj.key`) — used when key name is known and is a valid identifier.
> - **Bracket notation** (`obj["key"]`) — used when key is dynamic, stored in a variable, or has special characters/spaces.

```js
const key = "name";
console.log(userProfile[key]);   // ✅ "Vishal Sharma" — dynamic key
console.log(userProfile.key);    // ❌ undefined — looks for literal key "key"
```

---

## 2. Array vs Object — When to Use What?

```js
const student = {              // Object — labeled data (key-value)
    name: "vishal",
    age: 23,
    marks: 94.5
};

let student2 = ["vishal", 23, 94.5]; // Array — ordered, unlabeled list
```

### 💬 Interview Q: When would you choose an array over an object?

> **Answer:**  
> Use an **array** when order matters and data is homogeneous (list of items).  
> Use an **object** when each value has a meaningful label (structured entity).

```js
// ✅ Array — list of cart items (order matters)
const cart = ["Laptop", "Mouse", "Keyboard"];

// ✅ Object — one product entity (labels matter)
const product = {
    id: "p_01",
    name: "Laptop",
    price: 79999
};
```

---

## 3. Objects with Arrays as Values

```js
const item = {
    price: 100.99,
    discount: 50,
    colors: ["red", "pink"]
};
```

### 🏭 Production Example — E-Commerce Product Card

```js
const productCard = {
    id: "SKU_2201",
    title: "Nike Air Max",
    price: 4999,
    discount: 10,
    availableSizes: [6, 7, 8, 9, 10],
    images: ["img1.jpg", "img2.jpg"]
};

console.log(productCard.availableSizes[0]); // 6
console.log(productCard.images.length);     // 2
```

### 💬 Interview Q: How do you access the first color in the `item` object?

```js
console.log(item.colors[0]);    // "red"
console.log(item["colors"][1]); // "pink"
```

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

### 🏭 Production Example — Twitter/X Feed Item

```js
const tweet = {
    tweetId: "tw_9910",
    author: {
        handle: "@vishal123",
        verified: false
    },
    content: "Cracked 🔥",
    likes: 2400,
    reposts: 89,
    tags: ["#coding", "#placement"],
    createdAt: "2024-05-26T10:30:00Z"
};

// Render tags dynamically
tweet.tags.forEach(tag => console.log(tag));
// "#coding"
// "#placement"
```

---

## 5. Key Coercion — JS Converts All Keys to Strings

```js
const example = {
    1: "a",
    2: "b",
    null: "c",
    true: "d",
    undefined: "e"
};
```

### 🔍 What actually happens internally?

```js
console.log(Object.keys(example));
// ["1", "2", "null", "true", "undefined"]
//  ☝️ ALL keys become strings automatically

console.log(example[1]);         // "a"  — number 1 → "1"
console.log(example["1"]);       // "a"  — same key
console.log(example[null]);      // "c"  — null → "null"
console.log(example[true]);      // "d"  — true → "true"
```

### 💬 Interview Q: Can you use an object as a key in a plain JS object?

> **Answer:** No. If you use an object as a key, JS calls `.toString()` on it → `"[object Object]"`.
> All such keys collide into one. Use a **Map** instead for object keys.

```js
const map = new Map();
const keyObj = { id: 1 };
map.set(keyObj, "value");
console.log(map.get(keyObj)); // "value" ✅
```

---

## 6. Dynamic Mutation — Add, Update, Delete Properties

```js
student["name"] = "nishad";    // Update existing key
student["gender"] = "male";    // Add new key
student["marks"] = [4, 5, 2];  // Change type of value

console.log(student);
// { name: 'nishad', age: 23, marks: [4,5,2], gender: 'male' }

delete student.marks;
console.log(student);
// { name: 'nishad', age: 23, gender: 'male' }
```

### 🏭 Production Example — Shopping Cart Update

```js
let cartItem = {
    productId: "p_10",
    quantity: 1,
    price: 499
};

// User clicks "+" → update quantity
cartItem["quantity"] = 3;

// Apply coupon → add new field
cartItem["couponApplied"] = "SAVE10";

// Remove if item is unavailable
delete cartItem.couponApplied;

console.log(cartItem);
// { productId: 'p_10', quantity: 3, price: 499 }
```

### 💬 Interview Q: Does `delete` fully remove a key?

> **Answer:** `delete` removes the key from the object entirely. After deletion, `key in obj` returns `false` and `obj.key` returns `undefined`. It does **not** affect memory for primitive values, but it releases the reference for object values.

```js
const obj = { x: 10 };
delete obj.x;
console.log("x" in obj);  // false
console.log(obj.x);        // undefined
```

---

## 7. Object of Objects — Nested Structure

```js
const classInfo = {
    vishal: { grade: "A+", city: "delhi" },
    ravi:   { grade: "B",  city: "mumbai" },
    karan:  { grade: "C",  city: "Lucknow" }
};

classInfo["vishal"]["city"] = "gurgaon"; // Deep mutation
console.log(classInfo.vishal.grade);     // "A+"
```

### 🏭 Production Example — User Roles Dashboard

```js
const userRoles = {
    vishal: { role: "admin",  permissions: ["read", "write", "delete"] },
    ravi:   { role: "editor", permissions: ["read", "write"] },
    guest:  { role: "viewer", permissions: ["read"] }
};

// Check permission before action
function canDelete(username) {
    return userRoles[username]?.permissions.includes("delete") ?? false;
}

console.log(canDelete("vishal")); // true
console.log(canDelete("ravi"));   // false
```

### 💬 Interview Q: What is optional chaining `?.` and why use it with nested objects?

> **Answer:** `?.` short-circuits to `undefined` instead of throwing a TypeError if a property doesn't exist mid-chain. Critical in production to avoid app crashes when data may be incomplete.

```js
const data = { user: null };
console.log(data.user.name);    // ❌ TypeError: Cannot read properties of null
console.log(data.user?.name);   // ✅ undefined — safe
```

---

## 8. Array of Objects — Most Common Data Structure in Real Apps

```js
const classInfoArr = [
    { name: "vishal", grade: "A", city: "delhi" },
    { name: "deepak", grade: "B", city: "Patna" }
];

classInfoArr[0]["gender"] = "male";
console.log(classInfoArr[0]["name"]); // "vishal"
```

### 🏭 Production Example — Rendering a User List (React-like logic)

```js
const users = [
    { id: 1, name: "Vishal",  role: "Admin",  active: true },
    { id: 2, name: "Deepak",  role: "Editor", active: false },
    { id: 3, name: "Priya",   role: "Viewer", active: true }
];

// Filter active users
const activeUsers = users.filter(user => user.active);
console.log(activeUsers.length); // 2

// Get just names
const names = users.map(user => user.name);
console.log(names); // ["Vishal", "Deepak", "Priya"]

// Find by ID
const found = users.find(user => user.id === 2);
console.log(found.name); // "Deepak"
```

### 💬 Interview Q: How do you update a specific object inside an array?

```js
// Update role for user with id === 2
const updatedUsers = users.map(user =>
    user.id === 2 ? { ...user, role: "Admin" } : user
);
console.log(updatedUsers[1].role); // "Admin"
```

> **Key concept:** Always return a new array with spread (`...`) in production — avoid direct mutation for predictable state management (React/Redux pattern).

---

## 9. Math Object — Built-in Utility

```js
console.log(Math.pow(2, 3));    // 8        — 2³
console.log(Math.floor(5.544)); // 5        — round DOWN
console.log(Math.abs(-12.3));   // 12.3     — remove negative sign
console.log(Math.random());     // 0.7291.. — float between 0 (inclusive) and 1 (exclusive)
```

### Quick Reference

| Method | What it does | Example |
|--------|-------------|---------|
| `Math.floor(x)` | Rounds down | `Math.floor(4.9)` → `4` |
| `Math.ceil(x)` | Rounds up | `Math.ceil(4.1)` → `5` |
| `Math.round(x)` | Standard rounding | `Math.round(4.5)` → `5` |
| `Math.abs(x)` | Absolute value | `Math.abs(-7)` → `7` |
| `Math.pow(x,y)` | Exponent | `Math.pow(3,2)` → `9` |
| `Math.max(...arr)` | Largest value | `Math.max(1,5,3)` → `5` |
| `Math.min(...arr)` | Smallest value | `Math.min(1,5,3)` → `1` |
| `Math.sqrt(x)` | Square root | `Math.sqrt(16)` → `4` |

### 🏭 Production Example — Price Formatting

```js
const rawPrice = 1299.785;
const display = Math.floor(rawPrice * 100) / 100; // 1299.78 — no rounding up
const discount = Math.abs(rawPrice - 1499);        // 199.215 — price drop value

console.log(`₹${display}`);  // ₹1299.78
```

---

## 10. Generating Random Integers — The Formula

### Core Formula

```
Math.floor(Math.random() * N) + START
```

- Generates a random integer from `START` to `START + N - 1`

```js
// 0 to 99
let num = Math.floor(Math.random() * 100);

// 1 to 100
let num2 = Math.floor(Math.random() * 100) + 1;

// 20 to 24 (any 5 numbers starting from 20)
console.log(Math.floor(Math.random() * 5) + 20);

// 🎲 Dice: 1 to 6
console.log(Math.floor(Math.random() * 6) + 1);
```

### 🏭 Production Utility — `getRandomInt(min, max)`

This is the **standard production function** used in games, OTP generators, sampling:

```js
function getRandomInt(min, max) {
    // Inclusive on both ends
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(getRandomInt(1, 6));    // Dice roll
console.log(getRandomInt(100000, 999999)); // 6-digit OTP
console.log(getRandomInt(1, 10));   // 1 to 10
```

### 💬 Interview Q: Why does `Math.random() * 6 + 1` NOT give you 1–6 correctly?

```js
// ❌ WRONG
Math.random() * 6 + 1
// Range: 1.0 to 6.999... → floor gives 1 to 6 ✅ (but only by accident)
// Actually this one works, but conceptually:

// ✅ CORRECT and CLEAR
Math.floor(Math.random() * 6) + 1
// Math.random() → [0, 1)
// * 6           → [0, 6)
// floor         → 0, 1, 2, 3, 4, 5
// + 1           → 1, 2, 3, 4, 5, 6  ✅
```

> The correct approach uses `Math.floor` **before** `+1` to control the integer range precisely. Always apply floor first.

---

## 🔁 Concept Recap — Quick Cheatsheet

```
Object Literal     → { key: value }           → labeled entity
Array              → [val1, val2]             → ordered list
Object of Objects  → { key: { key: val } }    → nested structure
Array of Objects   → [{ key: val }, ...]      → most common in APIs

Access:            obj.key  OR  obj["key"]
Dynamic key:       obj[variable]
Add property:      obj["newKey"] = value
Update:            obj.key = newValue
Delete:            delete obj.key
Safe deep access:  obj?.nested?.key

Math.random()      → float [0, 1)
Random int (a–b):  Math.floor(Math.random() * (b - a + 1)) + a
```

---

## 🎯 Must-Know Interview Questions from This File

1. **What is the difference between an object and an array in JS?**
2. **How do you safely access deeply nested object properties?** (optional chaining)
3. **What does `delete` do to an object key?**
4. **Why are all object keys converted to strings?**
5. **How do you update an object inside an array without mutating the original?** (spread operator)
6. **Write a function to generate a random number between any two given integers.**
7. **What is the difference between `Math.floor`, `Math.ceil`, and `Math.round`?**
8. **When would you use `Map` over a plain object?**

---

> 💡 **Tip for  Interviews:** You'll almost never be asked to just "explain objects." Instead, they'll give you a data structure like an array of objects and ask you to filter, map, reduce, or transform it. Make sure you're fluent with `.map()`, `.filter()`, `.find()`, `.reduce()` on arrays of objects — that's where 80% of JS DSA interview questions live.
