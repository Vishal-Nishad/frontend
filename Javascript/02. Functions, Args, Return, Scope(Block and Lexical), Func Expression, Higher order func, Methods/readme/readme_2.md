# JavaScript — Functions, Higher-Order Functions & Methods 

---

## 1. Basic Function Declaration & Loops

```js
function print1to5() {
    for (let i = 1; i <= 5; i++) {
        console.log(i);
    }
}
print1to5();
```

**Console Output:**
```
1
2
3
4
5
```

### 🎯 Interview Angle

> **Q: What is the difference between `var`, `let`, and `const` inside a `for` loop?**

This is critical — `var` leaks out of the loop block, `let` doesn't.

```js
for (var i = 0; i < 3; i++) {}
console.log(i);  // 3 ← var leaks out! BAD

for (let j = 0; j < 3; j++) {}
console.log(j);  // ReferenceError ← let is block-scoped ✅
```

**Production insight:** The classic async-in-loop bug uses `var`:

```js
// BUG: all callbacks print 3 because var is shared
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);  // 3, 3, 3
}

// FIX: use let — each iteration gets its own binding
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);  // 0, 1, 2
}
```

This exact bug appears in **Flipkart, Swiggy, and Razorpay** frontend interviews.

---

## 2. Conditional Logic in Functions

```js
function isAdult(n) {
    if (n >= 18) {
        console.log("Adult");
    } else {
        console.log("Not Adult");
    }
}

isAdult(80);   // Adult
isAdult(15);   // Not Adult
```

### 🎯 Interview Angle

> **Q: Rewrite this function to return a value instead of printing — and explain why returning is better.**

```js
// ❌ Logging inside a function kills testability and reusability
function isAdult(n) {
    console.log(n >= 18 ? "Adult" : "Not Adult");
}

// ✅ Return the result — caller decides what to do with it
function isAdult(n) {
    return n >= 18;
}

// Now it's testable, reusable, and composable
console.log(isAdult(20));            // true
const label = isAdult(15) ? "Adult" : "Minor";
const adults = users.filter(u => isAdult(u.age));  // works in pipelines!
```

**Production insight:** Functions that `console.log` internally are impossible to unit test. In production code (and interviews at product companies), functions should **return values** and let the calling layer decide on output. This follows the **Single Responsibility Principle**.

---

## 3. Dice Number Generator

```js
function diceNumber() {
    console.log(Math.floor(Math.random() * 6) + 1);
}
diceNumber(); // e.g. 4
```

**Console Output (sample):**
```
4
2
6
1
```

### 🎯 Interview Angle

> **Q: Make this function pure and reusable — what changes?**

```js
// Pure version: no side effects, always returns a value
function rollDice(sides = 6) {
    return Math.floor(Math.random() * sides) + 1;
}

console.log(rollDice());     // standard 6-sided dice
console.log(rollDice(20));   // D20 for custom games
console.log(rollDice(2));    // coin flip: 1 or 2
```

**Production insight:** In a real game backend (e.g., a Ludo or card game app), dice rolls need to be **seeded and reproducible** for replay functionality. `Math.random()` cannot be seeded in JS. Production systems use a seeded PRNG library like `seedrandom` or server-side generation to ensure fairness and auditability — a common system design discussion point.

---

## 4. Average of N Numbers

```js
function average3(a, b, c) {
    console.log((a + b + c) / 3);
}
average3(4, 6, 5);  // 5
```

**Console Output:**
```
5
```

### 🎯 Interview Angle

> **Q: Generalise this to work for any number of arguments.**

```js
// Using rest parameters (...args) — handles any count
function average(...nums) {
    if (nums.length === 0) return 0;
    const sum = nums.reduce((acc, n) => acc + n, 0);
    return sum / nums.length;
}

console.log(average(4, 6, 5));         // 5
console.log(average(10, 20, 30, 40));  // 25
console.log(average());                // 0  ← edge case handled
```

**Production insight:** Always handle edge cases (empty input, division by zero). In interviews, writing the naive solution first and then improving it for edge cases shows **engineering maturity**. The `reduce` pattern here is how you'd compute running totals in analytics dashboards.

---

## 5. Multiplication Table

```js
function printTable(n) {
    for (let i = 1; i <= 10; i++) {
        console.log(`${n} * ${i} = ${n * i}`);
    }
}
printTable(5);
```

**Console Output:**
```
5 * 1 = 5
5 * 2 = 10
5 * 3 = 15
...
5 * 10 = 50
```

### 🎯 Interview Angle

> **Q: What is a template literal and why is it preferred over string concatenation?**

```js
// Old way — error-prone with spacing
console.log(n + " * " + i + " = " + (n * i));

// Template literal — readable and handles expressions inline
console.log(`${n} * ${i} = ${n * i}`);

// Production use: building dynamic SQL-like strings, HTML, log messages
const logMsg = `[${new Date().toISOString()}] User ${userId} logged in from ${ip}`;
```

**Production insight:** Template literals are used everywhere in production — API error messages, log formatting, dynamic HTML rendering, and notification templates. Knowing their full power (multi-line strings, tagged templates) is a strong signal in JS interviews.

---

## 6. Natural Sum — `return` vs `console.log`

```js
function naturalSum(n) {
    sum = 0;           // ⚠️ BUG: no let/const — this is a global variable!
    for (let i = 1; i <= n; i++) {
        sum = sum + i;
    }
    return sum;
}

console.log(naturalSum(5));   // 15
```

**Console Output:**
```
15
```

### ⚠️ Bug Alert in Your Code

`sum = 0` without `let`/`const`/`var` creates an **implicit global variable** — this is one of the most dangerous bugs in JS.

```js
// ❌ Your code — sum leaks into global scope
function naturalSum(n) {
    sum = 0;   // window.sum in browser, global.sum in Node
    ...
}

// ✅ Fixed
function naturalSum(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}
```

### 🎯 Interview Angle

> **Q: Can you compute this sum without a loop? What's the O(1) formula?**

```js
// Gauss formula: sum of 1 to n = n*(n+1)/2
function naturalSum(n) {
    return (n * (n + 1)) / 2;
}

console.log(naturalSum(5));      // 15
console.log(naturalSum(100));    // 5050  ← famous Gauss story
console.log(naturalSum(1000));   // 500500
```

**Production insight:** The loop version is O(n), the formula is O(1). In a backend processing millions of records, O(1) vs O(n) matters enormously. Interviewers at FAANG-style companies specifically look for whether you know the mathematical optimisation.

---

## 7. String Array Concatenation

```js
function concatStrArr(ar) {
    let result = "";
    for (let i = 0; i < ar.length; i++) {
        result += ar[i];
    }
    return result;
}

const a = ["hello", "i", "am", "vishal"];
console.log(concatStrArr(a));
```

**Console Output:**
```
helloiamvishal
```

### 🎯 Interview Angle

> **Q: Three ways to join an array of strings — which is most performant?**

```js
const words = ["hello", "i", "am", "vishal"];

// Method 1: Manual loop (your code) — O(n²) due to string immutability in JS
let result = "";
for (let i = 0; i < words.length; i++) result += words[i];

// Method 2: .join() — built-in, most readable ✅
console.log(words.join(""));         // "helloiamvishal"
console.log(words.join(" "));        // "hello i am vishal"
console.log(words.join(", "));       // "hello, i, am, vishal"

// Method 3: .reduce() — functional style
const joined = words.reduce((acc, w) => acc + w, "");
```

**Production insight:** `+=` on strings in a loop creates a new string object every iteration — it's O(n²) in memory. `.join()` is always preferred. This matters when concatenating thousands of log lines or building large SQL query strings dynamically.

---

## 8. Higher-Order Functions (HOF) — Functions as Arguments

This is one of the most important concepts in JavaScript.

```js
let greet = function() {        // Function Expression
    console.log("hello");
};

function multipleGreet(func, count) {
    for (let i = 1; i <= count; i++) {
        func();
    }
}

multipleGreet(greet, 3);                          // hello (x3)
multipleGreet(function() { console.log("vishal"); }, 2);  // vishal (x2)
```

**Console Output:**
```
hello
hello
hello
vishal
vishal
```

### Function Declaration vs Function Expression

| Feature | Declaration | Expression |
|---|---|---|
| Syntax | `function foo() {}` | `let foo = function() {}` |
| Hoisted? | ✅ Yes — can call before defining | ❌ No — must define first |
| Named? | Always | Optional (can be anonymous) |
| Use case | Utility functions | Callbacks, HOFs, closures |

### 🎯 Interview Angle

> **Q: What is a Higher-Order Function? Name 3 built-in HOFs in JS.**

A **Higher-Order Function** either:
1. Takes a function as an argument, OR
2. Returns a function

```js
// Built-in HOFs you use every day:
const nums = [1, 2, 3, 4, 5];

nums.forEach(n => console.log(n));           // HOF: takes callback
nums.map(n => n * 2);                        // [2,4,6,8,10]
nums.filter(n => n % 2 === 0);               // [2,4]
nums.reduce((acc, n) => acc + n, 0);         // 15
setTimeout(() => console.log("done"), 1000); // HOF: takes callback
```

> **Q: What is the difference between a function declaration and a function expression?**

```js
// Hoisting demo
sayHello();          // ✅ Works! Declaration is hoisted
function sayHello() { console.log("Hello"); }

greet();             // ❌ TypeError: greet is not a function
var greet = function() { console.log("Hi"); };
```

**Production insight:** In Node.js/Express, every middleware is a HOF pattern — `app.use(middleware)`, `app.get('/path', handler)`. React's hooks like `useEffect(callback, deps)` are HOFs. Understanding HOFs is foundational to reading any production JS/Node codebase.

---

## 9. Factory Functions — HOFs That Return Functions

```js
function oddEvenFunc(req) {
    if (req == "odd") {
        return function(n) {
            console.log(!(n % 2 == 0));
        };
    } else if (req == "even") {
        return function(n) {
            console.log(n % 2 == 0);
        };
    } else {
        console.log("enter valid request");
    }
}

const fun = oddEvenFunc("odd");
fun(56);   // false (56 is even, so it's NOT odd)
fun(57);   // true
```

**Console Output:**
```
false
```

### 🎯 Interview Angle

> **Q: What is a closure? How does `oddEvenFunc` demonstrate it?**

A **closure** is a function that "remembers" the variables from its outer scope even after the outer function has returned.

```js
function makeMultiplier(factor) {
    // 'factor' is captured in the closure
    return function(n) {
        return n * factor;   // 'factor' is remembered!
    };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5));   // 10
console.log(triple(5));   // 15
console.log(double(7));   // 14
```

> **Q: What is a factory function? Give a real-world use case.**

A factory function **creates and returns customised functions** based on parameters.

```js
// Real-world: creating validators dynamically
function makeRangeValidator(min, max) {
    return function(value) {
        return value >= min && value <= max;
    };
}

const isValidAge    = makeRangeValidator(0, 120);
const isValidScore  = makeRangeValidator(0, 100);
const isValidPort   = makeRangeValidator(1024, 65535);

console.log(isValidAge(25));      // true
console.log(isValidScore(105));   // false
console.log(isValidPort(3000));   // true ← Node default port
```

**Production insight:** Closures power **memoization**, **rate limiters**, **debounce/throttle**, and **middleware factories** in production systems. If an interviewer asks about closures and you give this validator example, it shows you understand real-world application — not just theory.

---

## 10. Object Methods — Functions as Object Values

```js
const calculator = {
    add: function(a, b) { return a + b; },
    subtract: function(a, b) { return a - b; },
    product: function(a, b) { return a * b; }
};

console.log(calculator.subtract(3, 4));   // -1
```

**Console Output:**
```
-1
```

### Method Shorthand (ES6+)

```js
// Verbose (ES5)
const calc = {
    add: function(a, b) { return a + b; }
};

// Shorthand (ES6) — same behaviour, cleaner syntax ✅
const calc = {
    add(a, b) { return a + b; },
    sub(a, b) { return a - b; }
};
```

### 🎯 Interview Angle

> **Q: What is `this` inside an object method?**

```js
const counter = {
    count: 0,
    increment() {
        this.count++;           // 'this' refers to counter object
        return this.count;
    },
    reset() {
        this.count = 0;
        return this;            // return this for method chaining
    }
};

console.log(counter.increment());   // 1
console.log(counter.increment());   // 2
counter.reset();
console.log(counter.count);         // 0
```

> **Q: What is method chaining and where do you see it in production?**

```js
// Method chaining: each method returns `this`
const query = {
    table: "",
    conditions: [],
    from(t)    { this.table = t; return this; },
    where(c)   { this.conditions.push(c); return this; },
    build()    { return `SELECT * FROM ${this.table} WHERE ${this.conditions.join(" AND ")}`; }
};

const sql = query
    .from("users")
    .where("age > 18")
    .where("city = 'delhi'")
    .build();

console.log(sql);
// SELECT * FROM users WHERE age > 18 AND city = 'delhi'
```

**Production insight:** Method chaining is everywhere in production — jQuery, Mongoose (`Model.find().where().limit()`), Knex.js query builder, and even native JS arrays (`.filter().map().reduce()`). Understanding `this` and method chaining is essential for backend JS/Node.js roles.

---

## ⚡ Quick Revision — Concept Map

| Concept | One-Line Definition | Interview Trap |
|---|---|---|
| Function Declaration | Hoisted, callable before definition | `function foo(){}` |
| Function Expression | Not hoisted, stored in variable | `let foo = function(){}` |
| Arrow Function | Short syntax, no own `this` | `const foo = () => {}` |
| Higher-Order Function | Takes or returns a function | Every callback IS a HOF |
| Closure | Inner function remembers outer scope | Used in memoize, debounce |
| Factory Function | Returns a customized function | Closure + HOF combined |
| Object Method | Function stored as object property | `this` refers to the object |
| Method Shorthand | ES6 cleaner method syntax | Same as function value |
| `let` in loops | Block-scoped per iteration | `var` causes async loop bug |
| Implicit Global | Missing `let`/`const` = global leak | `sum = 0` is a bug! |

---

## 🏭 Production Patterns to Remember

1. **Always return, never log** inside utility functions — callers decide the output
2. **Use `let`/`const`** always — implicit globals are silent production bugs
3. **`.join("")`** over string `+=` in loops — avoid O(n²) string building
4. **Closures = state without classes** — used in debounce, throttle, memoize
5. **Method chaining** — return `this` to enable fluent APIs
6. **HOF mental model:** `forEach` logs, `map` transforms, `filter` selects, `reduce` aggregates — know when to use which
7. **Factory functions** create specialised functions from generic ones — key for building validator/formatter libraries

---

## 🔥 Must-Know HOF Patterns for Product Interviews

```js
const users = [
    { name: "vishal", age: 23, city: "delhi",  active: true  },
    { name: "ravi",   age: 17, city: "mumbai", active: false },
    { name: "karan",  age: 25, city: "delhi",  active: true  }
];

// 1. Get names of all active adults
const result = users
    .filter(u => u.active && u.age >= 18)
    .map(u => u.name);
// ["vishal", "karan"]

// 2. Count users per city
const cityCount = users.reduce((acc, u) => {
    acc[u.city] = (acc[u.city] || 0) + 1;
    return acc;
}, {});
// { delhi: 2, mumbai: 1 }

// 3. Find first user from delhi
const delhiUser = users.find(u => u.city === "delhi");
// { name: "vishal", ... }

// 4. Check if ALL users are adults
const allAdults = users.every(u => u.age >= 18);   // false
const someAdult = users.some(u => u.age >= 18);    // true
```

These 4 patterns — `filter+map`, `reduce` for grouping, `find`, `every/some` — cover **80% of array manipulation questions** in product company JS rounds.

