# 📘 JavaScript — Array Methods, Spread, Rest & Destructuring
> **Interview-Ready Reference** | Product-Based Company Prep

---

## 🧠 What This File Covers

| # | Concept | Interview Weight |
|---|---------|-----------------|
| 1 | `forEach` | ⭐⭐⭐⭐ |
| 2 | `map` & `filter` | ⭐⭐⭐⭐⭐ |
| 3 | `every` | ⭐⭐⭐ |
| 4 | `reduce` | ⭐⭐⭐⭐⭐ |
| 5 | Default Parameters | ⭐⭐⭐⭐ |
| 6 | Spread Operator `...` | ⭐⭐⭐⭐⭐ |
| 7 | Rest Parameter `...` | ⭐⭐⭐⭐⭐ |
| 8 | Array Destructuring | ⭐⭐⭐⭐⭐ |
| 9 | Object Destructuring | ⭐⭐⭐⭐⭐ |

---

## 1. `forEach` — Iterate Without Caring About Return Value

> `forEach` loops over every element and runs a function on it.
> **It returns `undefined` — always.** You cannot chain it or capture its output.

```js
const ar = [1, 2, 3, 4];

// Passing a named function
let print = function(el) {
    console.log(el);
};
ar.forEach(print);

// Passing an arrow function inline
const students = [
    { name: "vishal", marks: 100 },
    { name: "hela",   marks: 98 },
    { name: "reva",   marks: 67 }
];

students.forEach((student) => {
    console.log(student.marks);
});
```

### Console Output
```
1
2
3
4
100
98
67
```

### 💬 Interview Q: What is the difference between `forEach` and `map`?

| | `forEach` | `map` |
|--|-----------|-------|
| Returns | `undefined` | New array |
| Use when | Side effects (log, update DOM) | Transforming data |
| Chainable? | ❌ No | ✅ Yes |
| Mutates original? | No (unless you do it manually) | No |

```js
// ❌ forEach — trying to capture result
const result = [1, 2, 3].forEach(x => x * 2);
console.log(result); // undefined — forEach returns nothing

// ✅ map — for transformation
const doubled = [1, 2, 3].map(x => x * 2);
console.log(doubled); // [2, 4, 6]
```

### 🏭 Production Example — Sending Notifications to All Users

```js
const users = [
    { id: "u1", email: "vishal@gmail.com", name: "Vishal" },
    { id: "u2", email: "hela@gmail.com",   name: "Hela" }
];

// forEach — side effect only, no return needed
users.forEach((user) => {
    sendEmail(user.email, `Hi ${user.name}, your order is shipped!`);
    // we don't need a return value here
});
```

---

## 2. `map` — Transform Every Element Into Something New

> `map` runs a function on each element and **returns a brand new array** of the same length.
> The original array is **never modified.**

```js
const numarr = [1, 2, 3, 4];
const doubled = numarr.map((x) => x * 2);
console.log(doubled); // [2, 4, 6, 8]

const students = [
    { name: "vishal", marks: 100 },
    { name: "hela",   marks: 98 },
    { name: "reva",   marks: 67 }
];

const gpa = students.map((el) => el.marks / 10);
console.log(gpa); // [10, 9.8, 6.7]
```

### Console Output
```
[2, 4, 6, 8]
[10, 9.8, 6.7]
```

### 🏭 Production Example — Preparing API Response for Frontend

```js
// Raw DB data
const dbProducts = [
    { _id: "p1", product_name: "Laptop",   cost_price: 50000, tax: 0.18 },
    { _id: "p2", product_name: "Mouse",    cost_price: 400,   tax: 0.12 },
    { _id: "p3", product_name: "Keyboard", cost_price: 1500,  tax: 0.12 }
];

// Transform before sending to frontend
const apiResponse = dbProducts.map((p) => ({
    id: p._id,
    name: p.product_name,
    finalPrice: Math.round(p.cost_price * (1 + p.tax))
}));

console.log(apiResponse);
// [
//   { id: 'p1', name: 'Laptop',   finalPrice: 59000 },
//   { id: 'p2', name: 'Mouse',    finalPrice: 448 },
//   { id: 'p3', name: 'Keyboard', finalPrice: 1680 }
// ]
```

---

## 3. `filter` — Keep Only What Passes the Test

> `filter` runs a test function on each element and **returns a new array** containing only elements where the function returned `true`.

```js
const num = [3, 2, 4, 5, 2, 4, 6, 7, 9, 100];

const evenNum = num.filter((x) => x % 2 === 0);
console.log(evenNum); // [2, 4, 2, 4, 6, 100]
```

### 🏭 Production Example — Product Search + Filters (Flipkart style)

```js
const products = [
    { name: "Laptop",   price: 79999, brand: "Dell",  inStock: true },
    { name: "Phone",    price: 15999, brand: "Apple", inStock: false },
    { name: "Tablet",   price: 29999, brand: "Apple", inStock: true },
    { name: "Earbuds",  price: 1999,  brand: "Dell",  inStock: true }
];

// Filter: in stock + price under 30000
const affordable = products
    .filter(p => p.inStock && p.price < 30000);

console.log(affordable.map(p => p.name));
// ["Tablet", "Earbuds"]

// Chain map + filter — very common in interviews
const result = products
    .filter(p => p.brand === "Apple")
    .map(p => ({ name: p.name, price: `₹${p.price}` }));

console.log(result);
// [
//   { name: 'Phone',  price: '₹15999' },
//   { name: 'Tablet', price: '₹29999' }
// ]
```

### 💬 Interview Q: Write a function that takes an array and returns only unique values

```js
const arr = [1, 2, 2, 3, 4, 4, 5];
const unique = arr.filter((val, index) => arr.indexOf(val) === index);
console.log(unique); // [1, 2, 3, 4, 5]
```

---

## 4. `every` — Do ALL Elements Pass the Test?

> Returns a single `boolean` — `true` only if **every element** passes. Stops at first failure.

```js
const n = [2, 4];
const m = [1, 2, 3];

const res_n = n.every((i) => i % 2 === 0);
const res_m = m.every((i) => i % 2 === 0);

console.log(res_n, res_m); // true false
```

### Related: `some` — Do ANY Elements Pass?

```js
const prices = [200, 500, 1500, 800];

console.log(prices.every(p => p < 1000)); // false — 1500 fails
console.log(prices.some(p => p < 1000));  // true  — at least one passes
```

### 🏭 Production Example — Form Validation

```js
const formFields = [
    { name: "email",    value: "vishal@gmail.com", filled: true },
    { name: "password", value: "abc123",            filled: true },
    { name: "phone",    value: "",                  filled: false }
];

const isFormComplete = formFields.every(field => field.filled);
console.log(isFormComplete); // false — phone is empty

// Block form submit if not complete
if (!isFormComplete) {
    console.log("Please fill all required fields");
}
```

---

## 5. `reduce` — Collapse an Array Into a Single Value

> `reduce` is the most powerful array method. It processes each element with an **accumulator** and returns one final value — a number, string, object, or array.

```js
const m = [1, 2, 3];

const finalVal = m.reduce((accumulator, element) => {
    console.log(accumulator, element); // see step-by-step
    return accumulator + element;
});

console.log(finalVal); // 6
```

### Console Output — Step by Step
```
1  2   ← acc starts at first element (1), el is second (2)
3  3   ← acc is now 3 (1+2), el is third element (3)
6      ← final result
```

### ⚠️ With vs Without Initial Value

```js
const arr = [1, 2, 3];

// Without initial value — acc starts at arr[0]
arr.reduce((acc, el) => acc + el);
// Step: acc=1, el=2 → 3 | acc=3, el=3 → 6

// With initial value (0) — acc starts at 0
arr.reduce((acc, el) => acc + el, 0);
// Step: acc=0, el=1 → 1 | acc=1, el=2 → 3 | acc=3, el=3 → 6
// ✅ Always pass initial value when result might be an object/array
```

### Finding Max and Min with `reduce`

```js
const val = [4, 56, 3, 4, 23];

const maxVal = val.reduce((max, el) => (max > el ? max : el));
console.log(maxVal); // 56

const minVal = val.reduce((min, el) => (min < el ? min : el));
console.log(minVal); // 3
```

### 🏭 Production Examples — `reduce` Powers Everything

```js
const cartItems = [
    { name: "Laptop",   price: 79999, qty: 1 },
    { name: "Mouse",    price: 499,   qty: 2 },
    { name: "Keyboard", price: 1999,  qty: 1 }
];

// 1. Cart total
const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
console.log(`₹${total}`); // ₹82996

// 2. Group by category (reduce → object)
const orders = [
    { id: 1, status: "delivered" },
    { id: 2, status: "pending" },
    { id: 3, status: "delivered" },
    { id: 4, status: "cancelled" }
];

const grouped = orders.reduce((acc, order) => {
    const key = order.status;
    acc[key] = acc[key] ? [...acc[key], order] : [order];
    return acc;
}, {});

console.log(grouped);
// {
//   delivered: [{id:1,...}, {id:3,...}],
//   pending:   [{id:2,...}],
//   cancelled: [{id:4,...}]
// }

// 3. Flatten nested array
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = nested.reduce((acc, arr) => [...acc, ...arr], []);
console.log(flat); // [1, 2, 3, 4, 5, 6]
```

### 💬 Interview Q: Implement `map` using `reduce`

```js
function myMap(arr, fn) {
    return arr.reduce((acc, el) => {
        acc.push(fn(el));
        return acc;
    }, []);
}
console.log(myMap([1, 2, 3], x => x * 2)); // [2, 4, 6]
```

> Knowing how to build `map` and `filter` using `reduce` is a top-tier interview signal.

---

## 6. Default Parameters — Fallback Values for Arguments

```js
function addition(a, b = 5) {
    return a + b;
}

console.log(addition(10));     // 15 — b defaults to 5
console.log(addition(10, 30)); // 40 — b is overridden by 30
```

### Console Output
```
15
40
```

### 🏭 Production Example — API Query Defaults

```js
function fetchProducts(page = 1, limit = 20, sortBy = "popularity") {
    console.log(`Fetching page ${page}, ${limit} items, sorted by ${sortBy}`);
    // GET /products?page=1&limit=20&sort=popularity
}

fetchProducts();              // page 1, 20 items, popularity
fetchProducts(3);             // page 3, 20 items, popularity
fetchProducts(1, 50, "price"); // page 1, 50 items, price
```

### 💬 Interview Q: What happens if you pass `undefined` vs `null` as an argument?

```js
function greet(name = "Guest") {
    console.log(`Hello, ${name}`);
}

greet(undefined); // "Hello, Guest"  — default kicks in ✅
greet(null);      // "Hello, null"   — null is a real value, no default ⚠️
```

---

## 7. Spread Operator `...` — Expand Iterables Into Individual Values

> The spread operator **unpacks** an array, string, or object into individual elements.

```js
const arVal = [10, 110, 30];

console.log(10, 110, 30);   // 10 110 30
console.log(arVal);          // [10, 110, 30]  ← array as-is
console.log(...arVal);       // 10 110 30       ← expanded

// Math.min needs individual values, not an array
console.log(Math.min(arVal));    // NaN   ← ❌ array passed directly
console.log(Math.min(...arVal)); // 10    ← ✅ spread to individual args
```

### Console Output
```
10 110 30
[ 10, 110, 30 ]
10 110 30
NaN
10
```

### Spread with Arrays — Copy & Merge

```js
const arr   = [1, 2, 3, 4, 5];
const newArr = [...arr];  // shallow copy — independent from arr

const odd = [3, 5, 7];
const even = [2, 4, 6, 8];
const combined = [...even, ...odd];
console.log(combined); // [2, 4, 6, 8, 3, 5, 7]
```

### Spread with Objects — Copy & Extend

```js
const data = {
    email: "vishal@gmail.com",
    password: "abcd"
};

const newData = { ...data };                       // shallow copy
const extended = { ...data, id: 123, country: "india" }; // copy + add keys

console.log(extended);
// { email: 'vishal@gmail.com', password: 'abcd', id: 123, country: 'india' }

// Spread array into object — auto-indexes as keys
const arr5 = [3, 2, 45, 43];
console.log({ ...arr5 }); // { '0': 3, '1': 2, '2': 45, '3': 43 }
```

### 🏭 Production Example — Immutable State Updates (React/Redux pattern)

```js
// ✅ The #1 use of spread in production — update without mutation
const user = { id: 1, name: "Vishal", role: "viewer", city: "Delhi" };

// Promote user to admin — never mutate, always create new object
const updatedUser = { ...user, role: "admin" };
console.log(updatedUser);
// { id: 1, name: 'Vishal', role: 'admin', city: 'Delhi' }
console.log(user.role); // 'viewer' — original unchanged ✅

// Add item to cart — immutable array update
const cart = ["Laptop", "Mouse"];
const newCart = [...cart, "Keyboard"];
console.log(newCart); // ["Laptop", "Mouse", "Keyboard"]
console.log(cart);    // ["Laptop", "Mouse"] — unchanged ✅
```

### 💬 Interview Q: What is the difference between spread copy and reference copy?

```js
// Reference copy — both point to SAME object
const a = { x: 1 };
const b = a;
b.x = 99;
console.log(a.x); // 99 — a was affected ❌

// Spread copy — independent shallow copy
const c = { x: 1 };
const d = { ...c };
d.x = 99;
console.log(c.x); // 1 — c is safe ✅

// ⚠️ Shallow copy warning — nested objects are still shared
const e = { x: 1, nested: { y: 2 } };
const f = { ...e };
f.nested.y = 99;
console.log(e.nested.y); // 99 — nested is still shared ⚠️
```

---

## 8. Rest Parameter `...` — Bundle Arguments Into an Array

> Rest looks identical to spread (`...`) but does the **opposite** — it collects multiple arguments into one array. Used in **function parameters**.

```js
function printArgs(...args) {
    for (let i = 0; i < args.length; i++) {
        console.log("function got:", args[i]);
    }
}

printArgs("hello", "vishal", 1, 2, 3, "nishad");
```

### Console Output
```
function got: hello
function got: vishal
function got: 1
function got: 2
function got: 3
function got: nishad
```

### `arguments` Object vs Rest Parameter — Know the Difference

```js
// Old way — `arguments` object (NOT a real array)
function minNum() {
    console.log(arguments);        // Arguments object — array-like
    console.log(arguments.length); // works
    // arguments.reduce(...)       // ❌ TypeError — can't use array methods
}
minNum("hello", 2, 3, 4);

// ✅ Modern way — rest gives a REAL array
function sumRest(...args) {
    return args.reduce((res, el) => res + el);
}
console.log(sumRest(4, 5, 33)); // 42
```

### Console Output
```
[Arguments] { '0': 'hello', '1': 2, '2': 3, '3': 4 }
4
42
```

### Rest with Named Parameters — Capture Remaining Args

```js
function registerUser(name, email, ...permissions) {
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Permissions: ${permissions}`);
}

registerUser("Vishal", "v@gmail.com", "read", "write", "delete");
// Name: Vishal
// Email: v@gmail.com
// Permissions: read,write,delete
```

### 💬 Interview Q: What is the difference between spread and rest?

| | Spread `...` | Rest `...` |
|--|-------------|------------|
| Where used | Function **calls**, array/object literals | Function **definitions** |
| What it does | **Expands** one into many | **Collects** many into one |
| Example | `Math.min(...arr)` | `function fn(...args)` |

```js
// Spread — at call site, expanding
const nums = [1, 2, 3];
console.log(Math.max(...nums)); // 3  ← spreads array into args

// Rest — at definition, collecting
function sum(...nums) {         // ← collects all args into array
    return nums.reduce((a, b) => a + b, 0);
}
console.log(sum(1, 2, 3));     // 6
```

---

## 9. Array Destructuring — Unpack Array Into Named Variables

> Instead of `arr[0]`, `arr[1]`... you can extract values into named variables in one line.

```js
const nums = ["vishal", "hela", "raven", "tony", "peter", "bruce", "abc", "xyz"];

// Old way
// const winner      = nums[0];
// const runnerup    = nums[1];

// ✅ Destructuring — position-based
const [winner, runnerup, secondrunnerup, ...others] = nums;

console.log(winner);          // "vishal"
console.log(runnerup);        // "hela"
console.log(secondrunnerup);  // "raven"
console.log(others);          // ["tony", "peter", "bruce", "abc", "xyz"]
```

### Console Output
```
vishal
hela
raven
[ 'tony', 'peter', 'bruce', 'abc', 'xyz' ]
```

### Skipping Elements & Default Values

```js
const scores = [95, 87, 72, 60];

// Skip second element with empty comma
const [first, , third] = scores;
console.log(first, third); // 95  72

// Default value if element doesn't exist
const [a, b, c, d, e = 0] = scores;
console.log(e); // 0 — default since index 4 is undefined
```

### 🏭 Production Example — Destructuring API Response

```js
// useState in React returns an array — destructuring in action
// const [count, setCount] = useState(0);

// Swapping variables — classic interview question
let x = 5, y = 10;
[x, y] = [y, x];
console.log(x, y); // 10  5  ← swapped without temp variable ✅

// Destructuring function return
function getMinMax(arr) {
    return [Math.min(...arr), Math.max(...arr)];
}
const [min, max] = getMinMax([3, 1, 7, 2, 9]);
console.log(min, max); // 1  9
```

---

## 10. Object Destructuring — Unpack Object Into Named Variables

> Extract object properties into variables — with optional **renaming** and **defaults**.

```js
const student1 = {
    name:     "vishal",
    age:      15,
    class:    9,
    username: "vis@were",
    password: "abc"
};

// Syntax: { originalKey: newVarName = defaultValue }
let {
    username: user,                                          // rename username → user
    age,                                                     // same name
    password: secret = "if not in object then it prints"   // rename + default
} = student1;

console.log(user);   // "vis@were"
console.log(age);    // 15
console.log(secret); // "abc" — exists in object, default not used
```

### Console Output
```
vis@were
15
abc
```

### Default Value Kicks In When Key is Missing

```js
const config = { host: "localhost", port: 3000 };

const { host, port, timeout = 5000, retries = 3 } = config;
console.log(host);    // "localhost"
console.log timeout); // 5000  — not in config, default used ✅
console.log(retries); // 3     — not in config, default used ✅
```

### 🏭 Production Example — Destructuring in Function Parameters

This is everywhere in React props and API handlers:

```js
// Instead of accessing req.body.email, req.body.password...
function loginHandler({ email, password, rememberMe = false }) {
    console.log(`Logging in: ${email}`);
    console.log(`Remember: ${rememberMe}`);
    // authenticate(email, password)
}

loginHandler({ email: "v@gmail.com", password: "abc123" });
// Logging in: v@gmail.com
// Remember: false

// React-style component
function UserCard({ name, role = "viewer", avatar = "default.jpg" }) {
    return `<div>${name} | ${role} | ${avatar}</div>`;
}

console.log(UserCard({ name: "Vishal", role: "admin" }));
// <div>Vishal | admin | default.jpg</div>
```

### Nested Object Destructuring

```js
const order = {
    id: "ORD_001",
    user: {
        name: "Vishal",
        address: { city: "Delhi", pin: "110001" }
    },
    total: 4999
};

// Extract nested fields in one shot
const { id, user: { name, address: { city } }, total } = order;
console.log(id, name, city, total);
// ORD_001  Vishal  Delhi  4999
```

### 💬 Interview Q: What is the difference between array and object destructuring?

| | Array Destructuring | Object Destructuring |
|--|--------------------|--------------------|
| Order matters? | ✅ Yes — position-based | ❌ No — key-based |
| Rename syntax | Just use any variable name | `{ key: newName }` |
| Skip elements | Use empty comma `,` | Just omit the key |
| Rest syntax | `[a, ...rest]` | `{ a, ...rest }` |

---

## 🔁 Concept Recap — Quick Cheatsheet

```
forEach(fn)          → loop, returns undefined, use for side effects
map(fn)              → transform, returns NEW array of same length
filter(fn)           → keep matching, returns NEW array (shorter/same)
every(fn)            → true if ALL pass, false on first failure
some(fn)             → true if ANY pass
reduce(fn, init)     → collapse to ONE value (sum, object, flat array)

Default params       → function fn(a, b = 5) — fallback if undefined passed

Spread (...)
  [...arr]           → shallow copy of array
  [...a, ...b]       → merge arrays
  {...obj}           → shallow copy of object
  {...obj, key: val} → copy + override/add
  fn(...arr)         → expand array as function args

Rest (...)
  function fn(...args) → bundle all args into real array
  function fn(a, ...rest) → first arg named, rest collected

Array Destructuring  → const [a, b, ...rest] = arr  — position-based
Object Destructuring → const { key: alias = default } = obj — key-based
```

---

## 🎯 Must-Know Interview Questions from This File

1. **What is the difference between `forEach`, `map`, and `filter`?**
2. **Can you implement `map` using `reduce`? Write it.**
3. **What does `reduce` return if the array is empty and no initial value is given?**
4. **What is the difference between spread and rest — same syntax, different behavior?**
5. **What is a shallow copy? How does spread handle nested objects?**
6. **How do you swap two variables without a temp variable using destructuring?**
7. **What is the difference between `arguments` and rest parameters?**
8. **What happens when you pass `null` vs `undefined` for a default parameter?**
9. **How do you destructure a nested object in one line?**
10. **Implement `filter` using `reduce`. (Senior-level question)**

```js
// Answer to Q10 — filter using reduce
function myFilter(arr, fn) {
    return arr.reduce((acc, el) => {
        if (fn(el)) acc.push(el);
        return acc;
    }, []);
}
console.log(myFilter([1,2,3,4,5], x => x % 2 === 0)); // [2, 4]
```

---

> 💡 **Tip for Product-Based Interviews:** This entire file is **live coding territory**. Companies like Razorpay, Atlassian, Swiggy, and Zepto give problems like: "Group these orders by status", "Get the total cart value", "Find users above a threshold" — all solved with `map`, `filter`, `reduce` chained together. Practice writing these from memory without documentation. Destructuring is tested in React/Node contexts — they may show you a component or API handler and ask you to rewrite it cleanly.
