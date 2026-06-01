# 📘 JavaScript — Functions, Higher-Order Functions & Methods

---

## 🧠 What This File Covers

| # | Concept | Interview Weight |
|---|---------|-----------------|
| 1 | Function Declaration & Calls | ⭐⭐⭐⭐⭐ |
| 2 | Parameters vs Arguments | ⭐⭐⭐⭐ |
| 3 | Return vs Console.log | ⭐⭐⭐⭐⭐ |
| 4 | Function Expressions | ⭐⭐⭐⭐⭐ |
| 5 | Higher-Order Functions (HOF) | ⭐⭐⭐⭐⭐ |
| 6 | Factory Functions (HOF returning function) | ⭐⭐⭐⭐⭐ |
| 7 | Object Methods & Shorthand | ⭐⭐⭐⭐⭐ |

---

## 1. Function Declaration — The Basic Building Block

```js
function print1to5() {
    for (let i = 1; i <= 5; i++) {
        console.log(i);
    }
}
print1to5();
```

### Console Output
```
1
2
3
4
5
```

### 💬 Interview Q: What is a function declaration? Is it hoisted?

> **Answer:** A function declaration uses the `function` keyword and is **fully hoisted** — meaning you can call it even before it's defined in the code.

```js
sayHi(); // ✅ Works — hoisted
function sayHi() { console.log("Hi"); }

greet(); // ❌ TypeError — not hoisted
const greet = function() { console.log("Hello"); };
```

> This is one of the most-tested differences in  interviews — **hoisting of declarations vs expressions.**

---

## 2. Parameters & Conditional Logic Inside Functions

```js
function isAdult(n) {
    if (n >= 18) {
        console.log("Adult");
    } else {
        console.log("Not Adult");
    }
}

isAdult(80); // "Adult"
isAdult(15); // "Not Adult"
```

### 🏭 Production Example — Age Gate for Platform Access

In apps like Spotify, Hotstar, or alcohol-delivery platforms, age checks are a real backend pattern:

```js
function getAccessLevel(age, plan) {
    if (age < 13) return "restricted";
    if (age < 18) return "teen";
    if (plan === "premium") return "full-access";
    return "basic";
}

console.log(getAccessLevel(25, "premium")); // "full-access"
console.log(getAccessLevel(14, "premium")); // "teen"
console.log(getAccessLevel(8,  "free"));    // "restricted"
```

### 💬 Interview Q: What is the difference between a parameter and an argument?

> **Answer:**
> - **Parameter** → variable in the function definition: `function isAdult(n)` → `n` is the parameter
> - **Argument** → actual value you pass when calling: `isAdult(80)` → `80` is the argument

---

## 3. Functions That Use Math — Dice & Average

```js
function diceNumber() {
    console.log(Math.floor(Math.random() * 6) + 1);
}
diceNumber(); // Some number 1–6

function average3(a, b, c) {
    console.log((a + b + c) / 3);
}
average3(4, 6, 5); // 5
```

### 🏭 Production Example — A/B Testing Random Assignment

At companies like Flipkart or Amazon, users are randomly assigned to feature variants:

```js
function assignVariant(userId) {
    // Deterministic hash-based, but simplified concept:
    const bucket = Math.floor(Math.random() * 3); // 0, 1, or 2
    const variants = ["control", "variant_A", "variant_B"];
    return variants[bucket];
}

console.log(assignVariant("u_9821")); // "variant_A" (random)
```

---

## 4. ⚠️ `return` vs `console.log` — The #1 Beginner Mistake

This is a **very common interview trap.** Look at these two:

```js
// ❌ Only prints — value is lost after the function ends
function average3(a, b, c) {
    console.log((a + b + c) / 3);
}
let result = average3(4, 6, 5);
console.log(result); // undefined ← nothing was returned!

// ✅ Returns — value can be stored, reused, chained
function naturalSum(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum = sum + i;
    }
    return sum;
}
console.log(naturalSum(5)); // 15
let s = naturalSum(10);
console.log(s * 2);         // 110 ← can reuse the returned value
```

### Console Output
```
15
110
```

### 💬 Interview Q: When should a function use `return` vs `console.log`?

> **Answer:**
> - Use `console.log` only for **debugging** or logging during development.
> - Use `return` in **every production function** — so the result can be stored, passed to another function, rendered on screen, or sent over an API.
> - A function that only `console.log`s is a **dead end** — the value escapes nowhere.

```js
// Real pattern — compute, return, then decide what to do with it
function getCartTotal(items) {
    return items.reduce((acc, item) => acc + item.price, 0);
}

const total = getCartTotal([{ price: 499 }, { price: 199 }]);
console.log(`₹${total}`);  // ₹698  ← log it here, in one controlled place
```

---

## 5. Loop-Based Functions — Table & Sum

```js
function printTable(n) {
    for (let i = 1; i <= 10; i++) {
        console.log(`${n} * ${i} = ${n * i}`);
    }
}
printTable(5);
```

### Console Output
```
5 * 1 = 5
5 * 2 = 10
5 * 3 = 15
...
5 * 10 = 50
```

```js
function naturalSum(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum = sum + i;
    }
    return sum;
}
console.log(naturalSum(5)); // 15
```

### 💬 Interview Q: What is the formula for sum of 1 to N? Can you do it without a loop?

> **Answer:** Yes — Gauss's formula: `n * (n + 1) / 2`

```js
function naturalSumFast(n) {
    return (n * (n + 1)) / 2;
}
console.log(naturalSumFast(5));   // 15
console.log(naturalSumFast(100)); // 5050  ← O(1), no loop needed
```

> Knowing the O(1) alternative shows mathematical thinking — interviewers love this.

---

## 6. String Array Concatenation

```js
function concatStrArr(arr) {
    let result = "";
    for (let i = 0; i < arr.length; i++) {
        result += arr[i];
    }
    return result;
}

const a = ["hello", "i", "am", "vishal"];
console.log(concatStrArr(a)); // "helloiamvishal"
```

### 🏭 Production Upgrade — Same thing, with `.join()`

```js
// Your loop approach works. But production code uses built-ins:
const words = ["hello", "i", "am", "vishal"];
console.log(words.join(""));    // "helloiamvishal"
console.log(words.join(" "));   // "hello i am vishal"
console.log(words.join(", "));  // "hello, i, am, vishal"
```

### 💬 Interview Q: Write `concatStrArr` using `.reduce()`

```js
function concatStrArr(arr) {
    return arr.reduce((acc, str) => acc + str, "");
}
console.log(concatStrArr(["hello", " ", "vishal"])); // "hello vishal"
```

> `.reduce()` is a must-know for  interviews. Expect to implement `sum`, `concat`, `flatten`, `groupBy` all with it.

---

## 7. Function Expression — Storing Functions in Variables

```js
let greet = function() {
    console.log("hello");
};

greet(); // "hello"
```

### 💬 Interview Q: What is a function expression? How is it different from a declaration?

| | Function Declaration | Function Expression |
|--|---------------------|---------------------|
| Syntax | `function fn() {}` | `const fn = function() {}` |
| Hoisted? | ✅ Yes (fully) | ❌ No |
| Named? | Always | Optional |
| Use case | General reusable functions | Callbacks, HOFs, conditional assignment |

```js
// Declaration — hoisted ✅
greetUser();
function greetUser() { console.log("Hi User"); }

// Expression — NOT hoisted ❌
greetAdmin(); // TypeError: greetAdmin is not a function
const greetAdmin = function() { console.log("Hi Admin"); };
```

---

## 8. Higher-Order Functions (HOF) — Passing Functions as Arguments

> A **Higher-Order Function** is a function that takes another function as an argument OR returns a function.

```js
let greet = function() {
    console.log("hello");
};

function multipleGreet(func, count) {
    for (let i = 1; i <= count; i++) {
        func();
    }
}

multipleGreet(greet, 3);
// hello
// hello
// hello

// Pass anonymous function directly
multipleGreet(function() { console.log("vishal"); }, 2);
// vishal
// vishal
```

### ⚠️ Critical Rule — Pass the Definition, NOT the Call

```js
multipleGreet(greet, 3);    // ✅ Correct — passing the function itself
multipleGreet(greet(), 3);  // ❌ Wrong — greet() executes immediately,
                             //            returns undefined, then passes undefined
```

### 🏭 Production Example — Event System / Middleware

HOFs power the **entire JavaScript ecosystem** — event listeners, Array methods, Express middleware:

```js
// Array methods ARE higher-order functions
const prices = [100, 250, 80, 430, 60];

const expensive = prices.filter(function(price) {
    return price > 100;
});
console.log(expensive); // [250, 430]

const discounted = prices.map(function(price) {
    return price * 0.9;
});
console.log(discounted); // [90, 225, 72, 387, 54]

// setTimeout is a HOF — takes a function + delay
setTimeout(function() {
    console.log("Fetching user data...");
}, 2000);
```

### 💬 Interview Q: Name 5 built-in HOFs in JavaScript

> `Array.map()`, `Array.filter()`, `Array.reduce()`, `Array.forEach()`, `setTimeout()`, `addEventListener()` — they all accept a function as an argument.

---

## 9. Factory Functions — HOFs That Return Functions

> A **Factory Function** is a function that **returns a new function** — "manufacturing" behavior on demand.

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
fun(56); // false  (56 is NOT odd)
fun(7);  // true   (7 IS odd)

const isEven = oddEvenFunc("even");
isEven(4);  // true
isEven(9);  // false
```

### Console Output
```
false
true
true
false
```

### 🏭 Production Example — Role-Based Permission Factory

This exact pattern is used in **auth systems** (JWT validation, RBAC):

```js
function createPermissionChecker(role) {
    const permissions = {
        admin:  ["read", "write", "delete", "manage"],
        editor: ["read", "write"],
        viewer: ["read"]
    };

    const allowed = permissions[role] ?? [];

    return function(action) {
        return allowed.includes(action);
    };
}

const checkAdmin  = createPermissionChecker("admin");
const checkViewer = createPermissionChecker("viewer");

console.log(checkAdmin("delete"));  // true
console.log(checkViewer("write"));  // false
console.log(checkAdmin("manage"));  // true
```

### 💬 Interview Q: What is a closure? (This is what's happening above)

> **Answer:** When `createPermissionChecker` returns the inner function, that inner function **remembers** the `allowed` variable from its parent scope — even after `createPermissionChecker` has finished running. This "memory" is called a **closure**.

```js
function counter() {
    let count = 0;           // This variable is "closed over"
    return function() {
        count++;
        return count;
    };
}

const increment = counter();
console.log(increment()); // 1
console.log(increment()); // 2
console.log(increment()); // 3
// count is private — can't access it from outside
```

> **Closures are one of the top 3 most asked JS concepts in  interviews.** The factory function pattern is the most natural way to understand them.

---

## 10. Object Methods — Functions Living Inside Objects

```js
const calculator = {
    add: function(a, b) {
        return a + b;
    },
    subtract: function(a, b) {
        return a - b;
    },
    product: function(a, b) {
        return a * b;
    }
};

console.log(calculator.subtract(3, 4)); // -1
console.log(calculator.add(10, 5));     // 15
```

### Shorthand Syntax (ES6+) — Used in Every Modern Codebase

```js
// ✅ Shorthand — same behavior, cleaner syntax
const calc = {
    add(a, b)      { return a + b; },
    sub(a, b)      { return a - b; },
    multiply(a, b) { return a * b; },
    divide(a, b)   {
        if (b === 0) return "Cannot divide by zero";
        return a / b;
    }
};

console.log(calc.add(5, 3));     // 8
console.log(calc.divide(10, 0)); // "Cannot divide by zero"
```

### 🏭 Production Example — Service/Utility Module Pattern

In real codebases (Node.js, React services), methods live inside objects as modules:

```js
const UserService = {
    getUser(id) {
        // In real app: fetch from DB
        return { id, name: "Vishal", role: "admin" };
    },

    isAdmin(user) {
        return user.role === "admin";
    },

    formatDisplay(user) {
        return `${user.name} (${user.role})`;
    }
};

const user = UserService.getUser("u_01");
console.log(UserService.isAdmin(user));       // true
console.log(UserService.formatDisplay(user)); // "Vishal (admin)"
```

### 💬 Interview Q: What is the difference between a function and a method?

> **Answer:** A **method** is simply a function that is a **property of an object**. Every method is a function, but not every function is a method.

```js
// Function — standalone
function greet() { return "Hello"; }

// Method — belongs to an object
const obj = {
    greet() { return "Hello"; }
};

greet();      // calling a function
obj.greet();  // calling a method
```

---

## 🔁 Concept Recap — Quick Cheatsheet

```
Function Declaration  → function fn() {}         → hoisted ✅
Function Expression   → const fn = function() {} → NOT hoisted ❌
Arrow Function        → const fn = () => {}      → NOT hoisted ❌, no own `this`

return               → sends value out, reusable
console.log          → only displays, value is lost

Higher-Order Fn      → takes a function as argument  (map, filter, forEach)
Factory Function     → returns a function             (closures, RBAC, middleware)

Object Method        → function stored as object property
Method Shorthand     → add(a, b) { } instead of add: function(a, b) { }

Closure              → inner function remembers outer function's variables
                       even after outer function has returned
```

---

## 🎯 Must-Know Interview Questions from This File

1. **What is the difference between function declaration and function expression?**
2. **What is hoisting? Which function types are hoisted?**
3. **Why should functions `return` instead of `console.log`? Give a real example.**
4. **What is a Higher-Order Function? Name 5 built-in ones in JS.**
5. **What is a closure? Write a counter using closures.**
6. **What is the difference between passing `greet` and `greet()` to a HOF?**
7. **What is a factory function? Where is it used in real applications?**
8. **What is the difference between a function and a method?**
9. **Can you calculate sum of 1 to N without a loop?** (Gauss formula)
10. **Rewrite `concatStrArr` using `.reduce()`.**

---

> 💡 **Tip for  Interviews:** HOFs, closures, and `return` vs `console.log` are tested heavily because they reveal whether you understand **how JS actually executes code** — not just the syntax. When you see `.map()`, `.filter()`, `.reduce()` — recognize them as higher-order functions and know how to write custom versions from scratch. That's what separates candidates at Flipkart, Razorpay, Atlassian, etc.
