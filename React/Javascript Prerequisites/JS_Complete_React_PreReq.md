# 📘 Complete JavaScript — React Interview Preparation Guide
> **Every JS concept React is built on** | From Variables to Async/Await

---

## 🗺️ How This Guide Works

React is just JavaScript wearing a costume. Every time React confuses you, a JS concept is underneath it. This guide maps every JS topic directly to where React uses it.

| JS Concept | React Uses It For |
|-----------|-------------------|
| `var` / `let` / `const` | Every component, every hook declaration |
| Hoisting | Why hooks must always be at the top level |
| Arrow Functions | Every component, every event handler |
| HOF | `.map()` for lists, custom hooks |
| Destructuring | Props, `useState`, `useContext` |
| Spread / Rest | Immutable state updates |
| Conditionals | Conditional rendering |
| Array Methods | Rendering + filtering lists |
| Event Listeners | `onClick`, `onChange`, `onFocus`, `onBlur` |
| Bubbling / Capturing | Event delegation, `stopPropagation` |
| Timers | `useEffect` cleanup, debounce |
| Promises + Async/Await | `useEffect` data fetching |
| `try/catch` | Error boundaries, API error handling |
| Window Object | `localStorage`, `location`, scroll events |

---

# PART 1 — VARIABLES

## `var`, `let`, `const` — The Three Declarations

```js
var   name  = "vishal"; // old — avoid in modern JS
let   age   = 23;       // modern — value can change
const city  = "Delhi";  // modern — binding cannot be reassigned
```

### `var` — The Problematic One (Never Use in React)

```js
// Problem 1: Function-scoped, leaks out of blocks
if (true) {
    var leaked = "I escaped!";
}
console.log(leaked); // "I escaped!" ⚠️ — still accessible outside block

// Problem 2: Re-declarable — silent bugs
var score = 100;
var score = 200; // ✅ no error — just overwrites. Dangerous!
console.log(score); // 200

// Problem 3: Famous loop bug
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3  ← all share the SAME `i` (var is function-scoped)

// Fixed with let
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2  ← each iteration gets its OWN `i` ✅
```

### `let` — Block-Scoped, Re-Assignable

```js
let count = 0;
count = 1;       // ✅ re-assignment allowed
count = count + 1; // ✅

// let count = 5; // ❌ SyntaxError: Identifier 'count' already been declared

if (true) {
    let blockVar = "only inside";
    console.log(blockVar); // ✅ "only inside"
}
console.log(blockVar); // ❌ ReferenceError — block scope respected
```

### `const` — Block-Scoped, Immutable Binding (NOT Immutable Value)

```js
const name = "vishal";
// name = "hela"; // ❌ TypeError: Assignment to constant variable

// ⚠️ Critical: const does NOT freeze objects/arrays — only the VARIABLE BINDING
const user = { name: "vishal", age: 23 };
user.age  = 24;       // ✅ mutating the object — allowed
user.city = "Delhi";  // ✅ adding property — allowed
// user = {};         // ❌ re-assigning variable — NOT allowed

const nums = [1, 2, 3];
nums.push(4);  // ✅ mutating the array — allowed
nums[0] = 99;  // ✅ mutating element — allowed
// nums = [];  // ❌ re-assigning variable — NOT allowed

console.log(user); // { name: 'vishal', age: 24, city: 'Delhi' }
console.log(nums); // [99, 2, 3, 4]
```

### 💬 Interview Q: Why does React always use `const` for `useState`?

```js
// In React:
const [count, setCount] = useState(0);

// Because the VARIABLE (the destructured pair) never changes
// The STATE VALUE changes — but setCount handles that internally
// Using const signals "this binding won't be accidentally reassigned"
// It's the correct semantic — don't use let unless you truly re-assign
```

### Quick Comparison Table

| Feature | `var` | `let` | `const` |
|---------|-------|-------|---------|
| Scope | Function | Block | Block |
| Hoisted? | ✅ (as `undefined`) | ✅ (TDZ) | ✅ (TDZ) |
| Re-declarable? | ✅ | ❌ | ❌ |
| Re-assignable? | ✅ | ✅ | ❌ (binding) |
| Use in React? | ❌ Never | ✅ Loops, counters | ✅ Default |

---

# PART 2 — HOISTING

## Hoisting — Declarations Move to the Top

> JS **compilation phase** moves all declarations to the top of their scope before execution.
> Only **declarations** are hoisted — not initializations (assignments).

### Function Declaration — Fully Hoisted ✅

```js
sayHello(); // ✅ Works — called BEFORE definition

function sayHello() {
    console.log("Hello!");
}
// Output: "Hello!"

// JS sees it as:
function sayHello() { console.log("Hello!"); } // moved to top
sayHello();
```

### `var` — Hoisted as `undefined`

```js
console.log(name); // undefined — NOT ReferenceError
var name = "vishal";
console.log(name); // "vishal"

// What JS internally does:
var name;          // declaration hoisted — value is undefined
console.log(name); // undefined
name = "vishal";   // assignment stays in place
console.log(name); // "vishal"
```

### `let` and `const` — Temporal Dead Zone (TDZ)

```js
// let and const ARE hoisted — but trapped in TDZ until their declaration line
// Accessing them before declaration = ReferenceError

console.log(age); // ❌ ReferenceError: Cannot access 'age' before initialization
let age = 23;
console.log(age); // ✅ 23

console.log(PI);  // ❌ ReferenceError: Cannot access 'PI' before initialization
const PI = 3.14;
```

### Visualizing the Temporal Dead Zone

```
┌─────────────────────────────────────────┐
│ Scope starts                            │
│                                         │
│  ←── TDZ for `age` begins here          │
│  console.log(age) ← ❌ ReferenceError   │
│  console.log(age) ← ❌ ReferenceError   │
│                                         │
│  let age = 23; ← TDZ ends, age = 23    │
│                                         │
│  console.log(age) ← ✅ 23               │
└─────────────────────────────────────────┘
```

### Function Expression Hoisting

```js
greet();     // ❌ TypeError: greet is not a function
var greet = function() { console.log("Hi"); };

sayBye();    // ❌ ReferenceError: Cannot access 'sayBye' before initialization
const sayBye = () => console.log("Bye");
```

### Complete Hoisting Comparison

```js
console.log(a);  // undefined    ← var: hoisted as undefined
console.log(b);  // ReferenceError ← let: TDZ
console.log(c);  // ReferenceError ← const: TDZ
declared();      // "declared!"  ← function declaration: fully hoisted ✅
expressed();     // ReferenceError ← const arrow fn: TDZ

var a = 1;
let b = 2;
const c = 3;
function declared() { console.log("declared!"); }
const expressed = () => console.log("expressed!");
```

### 💬 Interview Q: Why must React Hooks always be at the top level?

```js
// ❌ WRONG — hook inside a condition
function Counter({ isActive }) {
    if (isActive) {
        const [count, setCount] = useState(0); // breaks React!
    }
}

// ✅ CORRECT — hook always at top level
function Counter({ isActive }) {
    const [count, setCount] = useState(0); // always called, always same order
    if (!isActive) return null;
}
```

> React tracks state by the **ORDER hooks are called** on each render.
> If a hook is inside a condition, it may or may not run — order changes between renders.
> React loses track of which state belongs to which hook.
> Same principle as hoisting — position in code matters to the engine.

---

# PART 3 — FUNCTIONS

## Arrow Functions — React's Default Function Style

```js
// 4 forms of arrow functions:

// 1. No params
const greet = () => console.log("Hello!");

// 2. One param — parentheses optional
const double = n => n * 2;

// 3. Multiple params — parentheses required
const add = (a, b) => a + b;

// 4. Multi-line body — curly braces + explicit return
const processUser = (user) => {
    const name = user.name.toUpperCase();
    return `Welcome, ${name}`;
};

// Implicit return of an object — wrap in ()
const getUser = () => ({ name: "vishal", age: 23 }); // ✅
const broken  = () => { name: "vishal" };             // ❌ {} = function body
```

### Arrow Function vs Regular Function — Key Differences

```js
// DIFFERENCE 1: `this` binding
const obj = {
    name: "vishal",
    greetRegular() {
        console.log(this.name); // ✅ "vishal" — own `this` = obj
    },
    greetArrow: () => {
        console.log(this.name); // ❌ undefined — no own `this`, inherits global
    }
};
obj.greetRegular(); // "vishal"
obj.greetArrow();   // undefined

// DIFFERENCE 2: Arrow inside method — GOOD use
const timer = {
    name: "vishal",
    start() {
        setTimeout(() => {
            console.log(this.name); // ✅ "vishal" — arrow inherits `this` from start()
        }, 1000);
    }
};

// DIFFERENCE 3: `arguments` object
function regular(...args) { console.log(arguments); } // ✅ has arguments
const arrow = (...args)   => { console.log(arguments); }; // ❌ no arguments object, use rest

// DIFFERENCE 4: Cannot be constructor
// new (() => {})(); // ❌ TypeError: (intermediate value) is not a constructor
```

| Feature | Regular Function | Arrow Function |
|---------|----------------|----------------|
| `this` | Own (dynamic) | Inherited (lexical) |
| `arguments` | ✅ Available | ❌ Not available |
| Constructor | ✅ `new fn()` works | ❌ Throws error |
| Hoisted? | ✅ (declaration) | ❌ |
| React use | Object methods | Components, callbacks |

---

## Higher-Order Functions (HOF)

> A **Higher-Order Function** takes a function as an argument OR returns a function.

```js
// HOF that takes a function
function runTwice(fn) {
    fn();
    fn();
}
runTwice(() => console.log("hello")); // "hello" "hello"

// HOF that returns a function (Factory Function)
function createMultiplier(factor) {
    return (number) => number * factor; // returns new function
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Built-in HOFs — used everywhere in React
[1,2,3].map(x => x * 2);      // map takes a function
[1,2,3].filter(x => x > 1);   // filter takes a function
[1,2,3].reduce((a,b) => a+b); // reduce takes a function

// setTimeout is a HOF
setTimeout(() => console.log("later"), 1000);
```

### 🏭 React HOF Pattern — Custom Hooks

```js
// Custom hooks ARE higher-order functions that return reactive values
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => { setData(data); setLoading(false); });
    }, [url]);

    return { data, loading }; // returns values/functions
}

// Used in component:
function UserProfile() {
    const { data, loading } = useFetch("/api/user/1"); // HOF consumption
    if (loading) return <p>Loading...</p>;
    return <h1>{data.name}</h1>;
}
```

---

# PART 4 — ARRAYS & OBJECTS

## Array Destructuring — Position-Based Unpacking

```js
const colors = ["red", "green", "blue", "yellow", "purple"];

// Old way — repetitive
const first  = colors[0]; // "red"
const second = colors[1]; // "green"

// ✅ Destructuring — clean and named
const [first, second, third, ...rest] = colors;
console.log(first);  // "red"
console.log(second); // "green"
console.log(third);  // "blue"
console.log(rest);   // ["yellow", "purple"]

// Skip elements with empty comma
const [, , blue] = colors;
console.log(blue); // "blue"

// Default values — used when element doesn't exist
const [a, b, c, d, e, f = "black"] = colors;
console.log(f); // "black" — index 5 doesn't exist, uses default

// Swap variables — no temp variable needed
let x = 5, y = 10;
[x, y] = [y, x];
console.log(x, y); // 10, 5 ✅
```

### 🏭 React: `useState` IS Array Destructuring

```js
// useState returns: [currentValue, setterFunction]
const [count, setCount] = useState(0);
// count   = current state value
// setCount = function to update state

// You can name them anything — it's positional
const [isOpen, setIsOpen]     = useState(false);
const [users, setUsers]       = useState([]);
const [error, setError]       = useState(null);
const [loading, setLoading]   = useState(true);
```

---

## Object Destructuring — Key-Based Unpacking

```js
const user = {
    name: "vishal",
    age: 23,
    city: "Delhi",
    role: "developer",
    email: "vishal@gmail.com"
};

// Basic destructuring
const { name, age, city } = user;
console.log(name, age, city); // "vishal" 23 "Delhi"

// Rename while destructuring
const { name: userName, role: userRole } = user;
console.log(userName); // "vishal"
console.log(userRole); // "developer"
// console.log(name);  // ← `name` const from above still works

// Default values — used when key missing
const { country = "India", verified = false } = user;
console.log(country);  // "India" — not in user object, default used
console.log(verified); // false

// Rename + default together
const { address: userAddress = "Not provided" } = user;
console.log(userAddress); // "Not provided"

// Rest in object destructuring
const { name: n, email, ...remaining } = user;
console.log(n);         // "vishal"
console.log(email);     // "vishal@gmail.com"
console.log(remaining); // { age: 23, city: "Delhi", role: "developer" }

// Nested object destructuring
const order = {
    id: "ORD001",
    user: {
        name: "vishal",
        address: { city: "Delhi", pin: "110001" }
    },
    total: 4999
};

const { id, user: { name: buyerName, address: { city: buyerCity } }, total } = order;
console.log(id, buyerName, buyerCity, total);
// "ORD001" "vishal" "Delhi" 4999
```

### 🏭 React: Props ARE Object Destructuring

```jsx
// Old way — accessing everything via props
function Card(props) {
    return <h1>{props.title}</h1>;
}

// ✅ Destructured — clean and direct
function Card({ title, description, imageUrl, isActive, onClick }) {
    return (
        <div className={isActive ? "active" : ""} onClick={onClick}>
            <img src={imageUrl} alt={title} />
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
}

// With default props via destructuring
function Button({ label = "Click me", color = "blue", disabled = false }) {
    return <button style={{ color }} disabled={disabled}>{label}</button>;
}

// Destructuring in useContext
const { user, login, logout, isAuthenticated } = useContext(AuthContext);
```

---

## Spread Operator `...` — Expand / Copy / Merge

```js
// ── ARRAYS ──

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

const copy    = [...arr1];            // [1, 2, 3] — independent shallow copy
const merged  = [...arr1, ...arr2];   // [1, 2, 3, 4, 5, 6]
const prepend = [0, ...arr1];         // [0, 1, 2, 3]
const append  = [...arr1, 4];         // [1, 2, 3, 4]

// Spread into function args
console.log(Math.max(...arr1));  // 3 — Math.max needs individual args

// ── OBJECTS ──

const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

const objCopy  = { ...obj1 };            // { a: 1, b: 2 }
const objMerge = { ...obj1, ...obj2 };   // { a: 1, b: 2, c: 3, d: 4 }
const override = { ...obj1, b: 99 };     // { a: 1, b: 99 } — b overridden ✅
const addProp  = { ...obj1, e: 5 };      // { a: 1, b: 2, e: 5 }

// ⚠️ Shallow copy warning
const deep = { x: 1, nested: { y: 2 } };
const copy2 = { ...deep };
copy2.nested.y = 99;
console.log(deep.nested.y); // 99 ⚠️ — nested objects still shared!
```

### 🏭 React: Spread for Immutable State Updates

```jsx
// React RULE: NEVER mutate state directly — always return new object/array

const [user, setUser] = useState({ name: "vishal", age: 23, city: "Delhi" });
const [items, setItems] = useState(["apple", "banana"]);

// ❌ WRONG — mutates directly, React won't re-render
user.age = 24;
setUser(user); // same reference — React thinks nothing changed

// ✅ Update one field
setUser({ ...user, age: 24 });
// { name: "vishal", age: 24, city: "Delhi" }

// ✅ Add item to array
setItems([...items, "cherry"]);
// ["apple", "banana", "cherry"]

// ✅ Remove item from array
setItems(items.filter(item => item !== "banana"));

// ✅ Update specific item in array of objects
const [users, setUsers] = useState([
    { id: 1, name: "vishal", active: true },
    { id: 2, name: "hela",   active: false }
]);

setUsers(users.map(u =>
    u.id === 2 ? { ...u, active: true } : u
));
// [{ id:1, name:"vishal", active:true }, { id:2, name:"hela", active:true }]

// ✅ Update nested object
const [profile, setProfile] = useState({
    name: "vishal",
    address: { city: "Delhi", pin: "110001" }
});

setProfile({
    ...profile,
    address: { ...profile.address, city: "Gurgaon" }
});
```

---

## Rest Parameter `...` — Collect Multiple Args Into Array

```js
// ── In function parameters ──

function sum(...numbers) {             // collects ALL args into array
    return numbers.reduce((a, b) => a + b, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15

// Named params + rest
function register(name, email, ...permissions) {
    console.log(name);        // "vishal"
    console.log(email);       // "v@gmail.com"
    console.log(permissions); // ["read", "write", "delete"]
}
register("vishal", "v@gmail.com", "read", "write", "delete");

// ── In destructuring ──

// Array rest
const [first, second, ...others] = [1, 2, 3, 4, 5];
console.log(first);  // 1
console.log(others); // [3, 4, 5]

// Object rest — forward remaining props
const { onClick, children, ...rest } = props;
return <button onClick={onClick} {...rest}>{children}</button>;
//                                ↑ spread rest props back onto element
```

### Spread vs Rest — Same Syntax, Opposite Purpose

| | Spread | Rest |
|--|--------|------|
| Position | Call sites, literals | Function definition, destructuring |
| Does | Expands one → many | Collects many → one |
| Example | `fn(...arr)` | `function fn(...args)` |

```js
// SPREAD — at call site: expands
const nums = [1, 2, 3];
console.log(Math.max(...nums)); // 3 — array → individual args

// REST — in definition: collects
function logAll(...args) {      // individual args → array
    args.forEach(a => console.log(a));
}
logAll(1, 2, 3); // 1, 2, 3
```

---

# PART 5 — CONDITIONALS

## `if / else` — Standard Branching

```js
const age = 20;
const balance = 500;

if (age >= 18 && balance > 0) {
    console.log("Can place order");
} else if (age >= 18 && balance <= 0) {
    console.log("Add money to wallet");
} else {
    console.log("Must be 18+");
}
// Output: "Can place order"
```

---

## Ternary Operator — Inline If/Else

```js
// syntax: condition ? valueIfTrue : valueIfFalse
const age = 20;
const status = age >= 18 ? "adult" : "minor";
console.log(status); // "adult"

// Nested ternary (use sparingly)
const score = 85;
const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "F";
console.log(grade); // "B"

// In assignments
const label = isLoggedIn ? "Logout" : "Login";
const color = isActive   ? "green"  : "gray";
```

### 🏭 React: Conditional Rendering with Ternary

```jsx
function UserGreeting({ isLoggedIn, isLoading, user }) {
    // Render entirely different components
    if (isLoading) return <Spinner />;

    return (
        <div>
            {/* Ternary — show one OR the other */}
            {isLoggedIn ? <Dashboard user={user} /> : <LoginPage />}

            {/* Ternary in text */}
            <p>Status: {user.isActive ? "Active" : "Inactive"}</p>

            {/* Ternary in className */}
            <div className={`card ${user.isPremium ? "premium" : "basic"}`}>
                {user.name}
            </div>

            {/* Ternary in style */}
            <button style={{ color: isLoggedIn ? "red" : "green" }}>
                {isLoggedIn ? "Logout" : "Login"}
            </button>
        </div>
    );
}
```

---

## `&&` and `||` — Short-Circuit Evaluation

### Logical AND `&&`

```js
// Returns the FIRST falsy value, or the LAST value if all are truthy
console.log(true  && "hello");   // "hello"  — all truthy, returns last
console.log(false && "hello");   // false    — short-circuits at false
console.log(0     && "hello");   // 0        — 0 is falsy
console.log("")   && "hello");   // ""       — empty string is falsy
console.log(null  && "hello");   // null     — null is falsy
console.log(1     && 2 && 3);    // 3        — all truthy, returns last
```

### Logical OR `||`

```js
// Returns the FIRST truthy value, or the LAST value if all are falsy
console.log("vishal" || "default"); // "vishal" — first is truthy
console.log("")       || "default"); // "default" — "" is falsy
console.log(null      || "default"); // "default" — null is falsy
console.log(0         || 42);        // 42 — 0 is falsy
console.log(false     || 0 || "");   // "" — all falsy, returns last
```

### Nullish Coalescing `??` — Only Null/Undefined Triggers Fallback

```js
// ?? only falls back for null and undefined — NOT for 0, "", false
console.log(null      ?? "default"); // "default" ✅
console.log(undefined ?? "default"); // "default" ✅
console.log(0         ?? "default"); // 0         ← 0 is valid, no fallback
console.log("")       ?? "default"); // ""        ← empty string is valid
console.log(false     ?? "default"); // false     ← false is valid

// vs || which treats ALL falsy values as fallback triggers:
console.log(0  || "default"); // "default" ← may not be what you want!
console.log(0  ?? "default"); // 0         ← correct — 0 IS a valid count
```

### 🏭 React: Conditional Rendering Patterns

```jsx
function Dashboard({ user, count, notifications }) {
    return (
        <div>
            {/* && — render ONLY if truthy */}
            {user.isAdmin && <AdminPanel />}
            {notifications.length > 0 && <NotifBadge count={notifications.length} />}

            {/* || — fallback if falsy */}
            <h2>{user.name || "Guest"}</h2>

            {/* ?? — fallback only for null/undefined */}
            <p>Items: {count ?? 0}</p>  {/* shows 0 if count=0, not "0 fallback" */}
            <p>Bio: {user.bio ?? "No bio provided"}</p>
        </div>
    );
}
```

### ⚠️ The `0 && ...` Bug — Most Common React Mistake

```jsx
// ❌ BUG — renders "0" as text on screen when count is 0!
{count && <Badge count={count} />}
// When count=0: 0 && <Badge> → returns 0 → React renders the number 0

// ✅ Fix 1 — explicit boolean comparison
{count > 0 && <Badge count={count} />}

// ✅ Fix 2 — double negation (convert to boolean)
{!!count && <Badge count={count} />}

// ✅ Fix 3 — ternary
{count ? <Badge count={count} /> : null}
```

---

## Optional Chaining `?.` — Safe Deep Property Access

```js
const user = {
    name: "vishal",
    address: { city: "Delhi" }
};

// Without optional chaining — crashes if intermediate is null/undefined
console.log(user.address.city);     // "Delhi" ✅
console.log(user.contact.phone);    // ❌ TypeError: Cannot read 'phone' of undefined

// With optional chaining — returns undefined, no crash
console.log(user.address?.city);    // "Delhi" ✅
console.log(user.contact?.phone);   // undefined ✅ — safe!
console.log(user.contact?.phone?.replace("-", "")); // undefined ✅ — chain stops

// Optional method call
console.log(user.getProfile?.());   // undefined — method doesn't exist, no crash

// With arrays
const data = null;
console.log(data?.[0]?.name);       // undefined ✅ — safe array access

// Combined with nullish coalescing
console.log(user.contact?.phone ?? "Phone not set"); // "Phone not set"
console.log(user.address?.city  ?? "City not set");  // "Delhi"
```

### 🏭 React: API Data Starts as null — Always Use `?.`

```jsx
function UserCard() {
    const [user, setUser] = useState(null); // starts null

    useEffect(() => {
        fetchUser().then(setUser);
    }, []);

    // Without optional chaining — crashes while loading (user is null)
    // return <p>{user.address.city}</p>; // ❌ TypeError!

    // With optional chaining — safe during null phase
    return (
        <div>
            <h2>{user?.name}</h2>
            <p>{user?.address?.city ?? "Loading..."}</p>
            <p>{user?.followers?.toLocaleString() ?? "0"} followers</p>
            <button onClick={user?.logout}>Logout</button>
        </div>
    );
}
```

---

# PART 6 — ARRAY METHODS

## `.map()` — Transform Every Element

```js
// Returns a NEW array of same length — original untouched
const nums = [1, 2, 3, 4, 5];

const doubled   = nums.map(n => n * 2);         // [2, 4, 6, 8, 10]
const squared   = nums.map(n => n ** 2);         // [1, 4, 9, 16, 25]
const strings   = nums.map(n => `Item ${n}`);    // ["Item 1", "Item 2", ...]
const objects   = nums.map(n => ({ id: n, val: n * 10 })); // [{id:1,val:10}, ...]

// With index
const indexed = nums.map((n, index) => `${index}: ${n}`);
// ["0: 1", "1: 2", "2: 3", "3: 4", "4: 5"]

// Transforming objects
const products = [
    { id: 1, name: "Laptop",   price: 79999 },
    { id: 2, name: "Mouse",    price: 499 },
    { id: 3, name: "Keyboard", price: 1999 }
];
const discounted = products.map(p => ({ ...p, price: p.price * 0.9 }));
const names      = products.map(p => p.name); // ["Laptop", "Mouse", "Keyboard"]
```

### 🏭 React: `.map()` for Rendering Lists

```jsx
function ProductList({ products }) {
    return (
        <ul>
            {products.map(product => (
                // key prop is REQUIRED — React uses it to track items
                <li key={product.id}>
                    <h3>{product.name}</h3>
                    <p>₹{product.price}</p>
                </li>
            ))}
        </ul>
    );
}
```

---

## `.filter()` — Keep Only Matching Elements

```js
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const evens    = nums.filter(n => n % 2 === 0);   // [2, 4, 6, 8, 10]
const odds     = nums.filter(n => n % 2 !== 0);   // [1, 3, 5, 7, 9]
const big      = nums.filter(n => n > 5);          // [6, 7, 8, 9, 10]

const users = [
    { id: 1, name: "vishal", active: true,  role: "admin" },
    { id: 2, name: "hela",   active: false, role: "viewer" },
    { id: 3, name: "reva",   active: true,  role: "editor" }
];

const activeUsers = users.filter(u => u.active);
// [{ id:1, name:"vishal", ...}, { id:3, name:"reva", ... }]

const admins = users.filter(u => u.role === "admin");
// [{ id:1, name:"vishal", role:"admin", ... }]

// Chain filter + map
const activeNames = users
    .filter(u => u.active)
    .map(u => u.name);
// ["vishal", "reva"]
```

### 🏭 React: filter for Search and Conditionals

```jsx
function UserList({ users, searchTerm, showActiveOnly }) {
    const filteredUsers = users
        .filter(u => showActiveOnly ? u.active : true)
        .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <p>{filteredUsers.length} users found</p>
            {filteredUsers.map(u => <UserCard key={u.id} user={u} />)}
        </div>
    );
}

// Remove item from state
const handleDelete = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
};
```

---

## `.reduce()` — Collapse to a Single Value

```js
const nums = [1, 2, 3, 4, 5];

// Sum
const sum = nums.reduce((accumulator, current) => accumulator + current, 0);
console.log(sum); // 15

// How it runs step by step:
// acc=0, curr=1 → return 1
// acc=1, curr=2 → return 3
// acc=3, curr=3 → return 6
// acc=6, curr=4 → return 10
// acc=10, curr=5 → return 15

// Max value
const max = nums.reduce((acc, curr) => (curr > acc ? curr : acc));
console.log(max); // 5

// Flatten array
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = nested.reduce((acc, arr) => [...acc, ...arr], []);
console.log(flat); // [1, 2, 3, 4, 5, 6]

// Group by property
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
// {
//   delivered: [{id:1,...}, {id:3,...}],
//   pending:   [{id:2,...}],
//   cancelled: [{id:4,...}]
// }

// Cart total
const cart = [
    { name: "Laptop", price: 79999, qty: 1 },
    { name: "Mouse",  price: 499,   qty: 2 }
];
const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
console.log(total); // 80997
```

---

## `.sort()` — Sort Array In Place

```js
// ⚠️ sort() MUTATES the original array and sorts as STRINGS by default!

const fruits = ["banana", "apple", "cherry", "date"];
fruits.sort();
console.log(fruits); // ["apple", "banana", "cherry", "date"] ✅ strings: fine

// ❌ Number sort bug — sorts as strings by default
const nums = [10, 1, 21, 2, 100];
nums.sort();
console.log(nums); // [1, 10, 100, 2, 21] ❌ sorted as strings!

// ✅ Number sort — provide comparator function
nums.sort((a, b) => a - b); // ascending
console.log(nums); // [1, 2, 10, 21, 100] ✅

nums.sort((a, b) => b - a); // descending
console.log(nums); // [100, 21, 10, 2, 1] ✅

// Sort objects by property
const users = [
    { name: "vishal", age: 23 },
    { name: "hela",   age: 21 },
    { name: "reva",   age: 25 }
];

users.sort((a, b) => a.age - b.age);  // ascending by age
// [{hela,21}, {vishal,23}, {reva,25}]

users.sort((a, b) => a.name.localeCompare(b.name)); // alphabetical
// [{hela}, {reva}, {vishal}]

// ✅ Sort without mutating original — use spread first
const sorted = [...nums].sort((a, b) => a - b);
// nums unchanged, sorted is new array
```

### Comparator Function Logic

```js
// (a, b) => a - b:
//  negative → a before b (a is smaller → comes first in ascending)
//  zero     → order unchanged
//  positive → b before a (b is smaller → comes first)

// Memory trick:
// a - b → Ascending  (A comes first)
// b - a → Descending (D comes first — reverse the letters)
```

---

# PART 7 — EVENT LISTENERS

## `onClick`, `onChange`, `onBlur`, `onFocus`

> In the browser, all native events exist. React wraps them in **Synthetic Events** — same properties, cross-browser consistent.

### `onClick` — Mouse Click

```js
// Vanilla JS
button.addEventListener("click", function(event) {
    console.log("clicked!");
    console.log(event.target); // the element clicked
});
```

```jsx
// React JSX — note camelCase
function Counter() {
    const [count, setCount] = useState(0);

    const handleClick = (event) => {
        console.log(event.target); // <button>
        setCount(count + 1);
    };

    // ✅ Pass function reference — NOT invocation
    return <button onClick={handleClick}>Count: {count}</button>;

    // ❌ Wrong — immediately invokes on render
    // return <button onClick={handleClick()}>...</button>;

    // ✅ If you need to pass args — wrap in arrow
    // return <button onClick={() => handleDelete(item.id)}>Delete</button>;
}
```

### `onChange` — Input Value Changes (fires on every keystroke)

```js
// Vanilla JS
input.addEventListener("change", function(e) { // fires on blur for inputs
    console.log(e.target.value);
});
input.addEventListener("input", function(e) {  // fires on every keystroke
    console.log(e.target.value);
});
```

```jsx
// React — onChange fires on every keystroke (like native "input" event)
function SearchBar() {
    const [query, setQuery] = useState("");

    return (
        <input
            type="text"
            value={query}            // controlled input — React owns the value
            onChange={(e) => setQuery(e.target.value)} // e.target.value = typed text
            placeholder="Search..."
        />
    );
}

// Controlled form
function LoginForm() {
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault(); // stop page reload
        console.log({ email, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={email}    onChange={e => setEmail(e.target.value)}    type="email" />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
            <button type="submit">Login</button>
        </form>
    );
}
```

### `onFocus` and `onBlur` — Element Focus State

```js
// Vanilla JS
input.addEventListener("focus", () => console.log("focused"));
input.addEventListener("blur",  () => console.log("left focus"));
```

```jsx
// React — validate after user leaves field (onBlur)
function EmailInput() {
    const [email, setEmail]     = useState("");
    const [error, setError]     = useState("");
    const [touched, setTouched] = useState(false);

    const handleBlur = () => {
        setTouched(true);
        if (!email.includes("@")) {
            setError("Enter a valid email address");
        } else {
            setError("");
        }
    };

    return (
        <div>
            <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setError("")}       // clear error when user re-enters
                onBlur={handleBlur}                // validate when user leaves
                className={error ? "error" : ""}
            />
            {touched && error && <p className="error-msg">{error}</p>}
        </div>
    );
}
```

### Event Object — Properties You Must Know

```js
element.addEventListener("click", function(event) {
    event.target;          // element that was ACTUALLY clicked (may be child)
    event.currentTarget;   // element where listener is ATTACHED
    event.type;            // "click", "keydown", "change", etc.
    event.preventDefault();// stop browser default (form reload, link navigate)
    event.stopPropagation();// stop event from bubbling up the DOM
    event.key;             // for keyboard events: "Enter", "ArrowUp", " "
    event.code;            // physical key: "KeyA", "Space", "Enter"
    event.target.value;    // for input elements: current value
});
```

---

# PART 8 — EVENT BUBBLING & CAPTURING

## Event Bubbling — Events Travel Upward

> When an event fires on an element, it **bubbles up** through every ancestor — child → parent → grandparent → document.

```html
<div id="outer">         <!-- listener 3 fires third -->
    <ul id="middle">     <!-- listener 2 fires second -->
        <li id="inner">  <!-- listener 1 fires first -->
            Click me
        </li>
    </ul>
</div>
```

```js
document.getElementById("inner").addEventListener("click", () => {
    console.log("1. inner <li> clicked");
});

document.getElementById("middle").addEventListener("click", () => {
    console.log("2. middle <ul> clicked");
});

document.getElementById("outer").addEventListener("click", () => {
    console.log("3. outer <div> clicked");
});

// Click the <li>:
// 1. inner <li> clicked
// 2. middle <ul> clicked
// 3. outer <div> clicked
// ← bubbles UP ✅
```

## Event Capturing — Events Travel Downward

```js
// Third argument true = capturing phase (document → target)
document.getElementById("outer").addEventListener("click", () => {
    console.log("1. outer — capturing");
}, true); // ← true = capturing

document.getElementById("middle").addEventListener("click", () => {
    console.log("2. middle — capturing");
}, true);

document.getElementById("inner").addEventListener("click", () => {
    console.log("3. inner — target");
});

// Click the <li>:
// 1. outer — capturing   (capturing: goes DOWN first)
// 2. middle — capturing
// 3. inner — target      (target phase)
// then bubbling back up...
```

## `stopPropagation()` — Stop the Bubble

```js
document.getElementById("inner").addEventListener("click", (e) => {
    e.stopPropagation(); // stops here — outer listener never fires
    console.log("inner clicked — bubble stopped");
});

document.getElementById("outer").addEventListener("click", () => {
    console.log("outer clicked"); // ← never fires when inner is clicked
});
```

## Event Delegation — One Listener for Many Children

```js
// ❌ BAD — individual listener on each item (doesn't work for dynamic items)
document.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", e => console.log(e.target.innerText));
});

// ✅ GOOD — one listener on parent, catches all children via bubbling
document.querySelector("ul").addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {      // check which child was clicked
        console.log(e.target.innerText);  // works for dynamic items too ✅
    }
});
```

### 💬 Interview Q: `e.target` vs `e.currentTarget`?

```js
ul.addEventListener("click", function(e) {
    console.log(e.target);        // the <LI> — what was actually clicked
    console.log(e.currentTarget); // the <UL> — where listener is attached
    // They differ when using event delegation
});
```

---

# PART 9 — TIMERS

## `setTimeout` — Run Once After Delay

```js
// setTimeout(callbackFunction, delayInMilliseconds)

console.log("start");

const timerId = setTimeout(() => {
    console.log("runs after 2 seconds");
}, 2000);

console.log("end"); // runs BEFORE the timeout callback

// Output:
// start
// end
// runs after 2 seconds (after 2s)

// Cancel before it fires
clearTimeout(timerId);
```

### `setTimeout(fn, 0)` — Deferred Execution Trick

```js
console.log("1");
setTimeout(() => console.log("2"), 0); // 0ms delay!
console.log("3");

// Output: 1, 3, 2
// setTimeout ALWAYS goes through the callback queue — even with 0ms
// Current call stack must empty first
```

### Debounce — Real Production Pattern

```js
// Problem: API called on EVERY keystroke
searchInput.addEventListener("input", () => fetchResults(query)); // too many calls!

// Solution: Debounce — only call after user STOPS typing for 400ms
let debounceTimer;
searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetchResults(e.target.value); // fires only after 400ms pause
    }, 400);
});
```

---

## `setInterval` — Repeat Every N Milliseconds

```js
// setInterval(callbackFunction, intervalInMilliseconds)

let count = 0;
const intervalId = setInterval(() => {
    count++;
    console.log(`Tick ${count}`);

    if (count === 5) {
        clearInterval(intervalId); // stop after 5 ticks
        console.log("Stopped!");
    }
}, 1000);

// Output (over 5 seconds):
// Tick 1
// Tick 2
// Tick 3
// Tick 4
// Tick 5
// Stopped!
```

### `setTimeout` vs `setInterval`

| | `setTimeout` | `setInterval` |
|--|-------------|--------------|
| Runs | Once after delay | Repeatedly at interval |
| Cancel | `clearTimeout(id)` | `clearInterval(id)` |
| Self-stop | Can recurse if needed | Must clearInterval |
| Overlap risk | ❌ None | ✅ If callback > interval |

### 🏭 React: `useEffect` Cleanup for Timers

```jsx
function Countdown({ seconds }) {
    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
        if (timeLeft === 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        // ✅ CLEANUP — clears interval when component unmounts or re-renders
        return () => clearInterval(timer);
    }, [timeLeft]);

    return <p>{timeLeft} seconds remaining</p>;
}
```

---

# PART 10 — ASYNCHRONOUS JAVASCRIPT

## The Call Stack & Event Loop

```
JS is SINGLE-THREADED — one thing at a time on the Call Stack.

┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
│  Call Stack  │    │  Web APIs    │    │  Callback Queue  │
│              │    │              │    │                  │
│  main()      │ →  │  setTimeout  │ →  │  () => log("hi") │
│              │    │  fetch()     │    │  () => render()  │
└──────────────┘    └──────────────┘    └──────────────────┘
         ↑_____________Event Loop checks: stack empty?___↑
```

> Event Loop: "Is the call stack empty? Yes → move next callback from Queue → Stack → run it."

---

## Callbacks — Async Without Promises

```js
// A callback is a function passed to another function to run later
function saveToServer(data, onSuccess, onFailure) {
    setTimeout(() => {
        const success = Math.random() > 0.5;
        if (success) onSuccess("Data saved!");
        else         onFailure("Server error!");
    }, 1000);
}

saveToServer(
    "vishal's data",
    (result) => console.log("✅", result), // success callback
    (error)  => console.log("❌", error)   // failure callback
);
```

---

## Callback Hell — The Problem

```js
// Sequential operations — each depends on previous
saveToServer("user data",
    () => { // success 1
        console.log("step 1 done");
        saveToServer("login data",
            () => { // success 2
                console.log("step 2 done");
                saveToServer("preferences",
                    () => { // success 3
                        console.log("step 3 done");
                        saveToServer("analytics",
                            () => console.log("step 4 done"), // success 4
                            () => console.log("step 4 failed") // failure 4
                        );
                    },
                    () => console.log("step 3 failed") // failure 3
                );
            },
            () => console.log("step 2 failed") // failure 2
        );
    },
    () => console.log("step 1 failed") // failure 1
);
// Pyramid of Doom — hard to read, debug, maintain
```

---

## Promises — The Solution

```js
// A Promise represents eventual success OR failure of async work
// States: Pending → Fulfilled OR Rejected (cannot go back)

function saveToServer(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = Math.random() > 0.3;
            if (success) resolve(`"${data}" saved successfully`);
            else         reject(`Failed to save "${data}"`);
        }, 1000);
    });
}

// Consume with .then() and .catch()
saveToServer("vishal")
    .then(result => {
        console.log("✅", result); // "✅ "vishal" saved successfully"
        return saveToServer("hela"); // chain: return next promise
    })
    .then(result => {
        console.log("✅", result);
        return saveToServer("reva");
    })
    .then(result => {
        console.log("✅", result);
    })
    .catch(error => {
        // ONE catch handles failure from ANY step
        console.log("❌", error);
    })
    .finally(() => {
        console.log("Done — success or failure"); // always runs
    });
```

### Console Output (if step 2 fails)
```
✅ "vishal" saved successfully
❌ Failed to save "hela"
Done — success or failure
```

---

## Promise API Methods — All 4

```js
const p1 = saveToServer("user");
const p2 = saveToServer("settings");
const p3 = saveToServer("profile");
```

### `Promise.all` — All Must Succeed (fail fast)

```js
Promise.all([p1, p2, p3])
    .then(results => {
        console.log(results); // ["user saved", "settings saved", "profile saved"]
        // ALL 3 run in parallel — wait for ALL to resolve
    })
    .catch(err => {
        console.log(err); // if ANY one fails, entire .all() rejects immediately
    });
```

### `Promise.allSettled` — All Run, Report Each Result

```js
Promise.allSettled([p1, p2, p3])
    .then(results => {
        results.forEach(r => {
            if (r.status === "fulfilled") console.log("✅", r.value);
            else                          console.log("❌", r.reason);
        });
        // Doesn't short-circuit on failure — reports all
    });
```

### `Promise.race` — First to Settle Wins

```js
Promise.race([p1, p2, p3])
    .then(result => console.log("First:", result))
    .catch(err   => console.log("First failed:", err));
// Returns as soon as ANY promise settles (resolve or reject)
// Use case: request timeout — race fetch against a timer promise
```

### `Promise.any` — First to SUCCEED Wins

```js
Promise.any([p1, p2, p3])
    .then(result => console.log("First success:", result))
    .catch(err   => console.log("All failed:", err));
// Returns first resolved value — only rejects if ALL fail
// Use case: try multiple CDN servers, use whichever responds first
```

| Method | Fails if | Resolves when | Use case |
|--------|---------|---------------|----------|
| `Promise.all` | Any fails | All succeed | Required parallel data |
| `Promise.allSettled` | Never | All settle | Independent parallel ops |
| `Promise.race` | First fails | First settles | Timeout pattern |
| `Promise.any` | All fail | First succeeds | Fallback servers |

---

## Async/Await — Cleaner Promise Syntax

```js
// async function ALWAYS returns a Promise
async function greet() {
    return "hello!"; // auto-wrapped in Promise.resolve("hello!")
}

greet().then(console.log); // "hello!"

// await PAUSES the async function — not the whole program
async function fetchUserData(userId) {
    const res  = await fetch(`/api/users/${userId}`); // pause until resolved
    const data = await res.json();                    // pause again
    return data;
}

// Equivalent to:
function fetchUserData(userId) {
    return fetch(`/api/users/${userId}`)
        .then(res  => res.json())
        .then(data => data);
}
```

### Execution Order — Most Tested Interview Topic

```js
async function demo() {
    console.log("A"); // runs synchronously when called
    await new Promise(r => setTimeout(r, 1000)); // pauses demo()
    console.log("B"); // runs after 1s
}

demo();
console.log("C"); // runs IMMEDIATELY after demo() pauses

// Output:
// A  ← synchronous part of demo()
// C  ← main thread continues while demo() is paused
// B  ← after 1 second
```

### Sequential vs Parallel — Senior-Level Distinction

```js
// ❌ Sequential — 3 seconds total (unnecessary!)
async function slow() {
    const user    = await fetchUser();    // 1s
    const orders  = await fetchOrders(); // 1s
    const reviews = await fetchReviews();// 1s — total: 3s
    // These don't depend on each other!
}

// ✅ Parallel — ~1 second total
async function fast() {
    const [user, orders, reviews] = await Promise.all([
        fetchUser(),    // all 3 start at the same time
        fetchOrders(),
        fetchReviews()
    ]);
    // total: time of the SLOWEST single request
}
```

---

## `try/catch/finally` — Async Error Handling

```js
async function loadUserData(userId) {
    try {
        const res = await fetch(`/api/users/${userId}`);

        // fetch does NOT reject for 404/500 — check res.ok manually!
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        return data;

    } catch (err) {
        // Catches: network failures, thrown errors, JSON parse errors
        console.error("Failed:", err.message);
        return null; // graceful failure

    } finally {
        // ALWAYS runs — success or failure
        // Use for: hide loading spinner, close DB connection, cleanup
        setIsLoading(false);
        console.log("Request complete");
    }
}
```

### `try/catch` Rules

```js
// Rule 1: Code AFTER the error in try is skipped
try {
    console.log("A");   // runs
    throw new Error();  // throws
    console.log("B");   // SKIPPED
} catch (err) {
    console.log("C");   // runs
}
console.log("D");       // runs — always executes after try/catch

// Rule 2: Re-throw to propagate to caller
async function getUser() {
    try {
        const data = await fetchUser();
        return data;
    } catch (err) {
        console.log("Logging error:", err);
        throw err; // re-throw — caller must also handle it
    }
}

// Rule 3: Error properties
try { undefined.property } catch(e) {
    console.log(e.name);    // "TypeError"
    console.log(e.message); // "Cannot read properties of undefined"
    console.log(e.stack);   // full stack trace
}
```

---

# PART 11 — WINDOW OBJECT

## The `window` Object — Browser's Global Object

> `window` is the global object in browsers. All global variables, functions, and browser APIs live on it. You can omit `window.` — it's implied.

```js
// window IS the global scope
var globalVar = "hello";
console.log(window.globalVar); // "hello" — same thing

// Functions on window
window.alert("Hello!");        // same as alert("Hello!")
window.console.log("Hi");      // same as console.log("Hi")
window.setTimeout(() => {}, 0);// same as setTimeout()
```

### `window.localStorage` — Persist Data Across Sessions

```js
// localStorage stores key-value pairs as STRINGS — persists after browser close

// Store (only strings — use JSON.stringify for objects)
localStorage.setItem("username", "vishal");
localStorage.setItem("theme", "dark");
localStorage.setItem("user", JSON.stringify({ name: "vishal", age: 23 }));

// Read
const username = localStorage.getItem("username");    // "vishal"
const theme    = localStorage.getItem("theme");       // "dark"
const user     = JSON.parse(localStorage.getItem("user")); // { name: "vishal", age: 23 }

// Delete one item
localStorage.removeItem("theme");

// Delete everything
localStorage.clear();

// Check if key exists
if (localStorage.getItem("token") !== null) {
    console.log("User is logged in");
}
```

### `window.sessionStorage` — Persist Data for One Tab Session

```js
// Same API as localStorage — but data is LOST when tab closes
sessionStorage.setItem("tempData", "value");
sessionStorage.getItem("tempData");
sessionStorage.removeItem("tempData");
// Use for: temporary form data, one-time tokens, tab-specific state
```

### localStorage vs sessionStorage

| | `localStorage` | `sessionStorage` |
|--|---------------|-----------------|
| Persists | Until manually cleared | Until tab closes |
| Shared across tabs? | ✅ Yes | ❌ No — tab-specific |
| Max size | ~5MB | ~5MB |
| Use for | Auth tokens, preferences | Temp form data, wizard steps |

### `window.location` — URL & Navigation

```js
console.log(window.location.href);      // full URL: "https://example.com/path?q=1"
console.log(window.location.origin);    // "https://example.com"
console.log(window.location.pathname);  // "/path"
console.log(window.location.search);    // "?q=1"
console.log(window.location.hash);      // "#section"
console.log(window.location.hostname);  // "example.com"

// Navigate to URL
window.location.href = "https://google.com"; // redirect
window.location.replace("https://google.com"); // redirect (no back button)
window.location.reload(); // reload current page
```

### `window.history` — Browser History Stack

```js
window.history.back();      // go back one page
window.history.forward();   // go forward one page
window.history.go(-2);      // go back 2 pages
window.history.go(1);       // go forward 1 page

// Push state without reload (used by React Router!)
window.history.pushState({ page: 1 }, "title", "/new-url");
window.history.replaceState({ page: 2 }, "title", "/other-url");
```

### `window.innerWidth` & `window.innerHeight` — Viewport Size

```js
console.log(window.innerWidth);  // e.g. 1440 (pixels)
console.log(window.innerHeight); // e.g. 900

// Responsive logic
if (window.innerWidth < 768) {
    console.log("Mobile view");
} else if (window.innerWidth < 1024) {
    console.log("Tablet view");
} else {
    console.log("Desktop view");
}

// Listen for resize
window.addEventListener("resize", () => {
    console.log("Width:", window.innerWidth);
});
```

### `window.scrollY` and Scroll Events

```js
console.log(window.scrollY); // pixels scrolled from top
console.log(window.scrollX); // pixels scrolled from left

// Listen for scroll
window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    if (scrolled > 100) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
});

// Scroll to position
window.scrollTo(0, 500);          // scroll to 500px from top
window.scrollTo({ top: 0, behavior: "smooth" }); // smooth scroll to top
```

### `window.navigator` — Browser & Device Info

```js
console.log(navigator.language);       // "en-US"
console.log(navigator.userAgent);      // browser string
console.log(navigator.onLine);         // true/false — internet connected?
console.log(navigator.platform);       // "Win32", "MacIntel"

// Geolocation
navigator.geolocation.getCurrentPosition(
    (pos) => {
        console.log(pos.coords.latitude);  // e.g. 28.6139
        console.log(pos.coords.longitude); // e.g. 77.2090
    },
    (err) => console.log("Location denied")
);

// Clipboard
navigator.clipboard.writeText("hello vishal")
    .then(() => console.log("Copied!"));
```

### `window.fetch` — HTTP Requests

```js
// fetch is a window method — global access
fetch("https://api.example.com/users")
    .then(res => res.json())
    .then(data => console.log(data));

// Same as:
window.fetch("https://api.example.com/users")...
```

---

## 🔁 Complete Cheatsheet

```
VARIABLES
  var    → function-scoped, hoisted as undefined, avoid
  let    → block-scoped, TDZ, re-assignable
  const  → block-scoped, TDZ, binding immutable (object/array contents mutable)

HOISTING
  function declarations  → fully hoisted ✅
  var                    → hoisted, value = undefined
  let / const            → hoisted but in TDZ (ReferenceError if accessed early)
  function expressions   → NOT hoisted

ARROW FUNCTIONS
  No own `this`  →  inherits lexically
  No `arguments` →  use rest ...args
  Cannot be new  →  not a constructor
  Implicit return: (a,b) => a+b   Object: () => ({key:val})

DESTRUCTURING
  Array:  const [a, b, ...rest] = arr  → position-based
  Object: const { key: alias = default, ...rest } = obj → key-based
  In React: useState, props, context all use destructuring

SPREAD / REST
  Spread  [...arr]  {...obj}  → expand/copy (shallow)
  Rest    function fn(...args) → collect into array
  In React: always spread for immutable state updates

CONDITIONALS
  if/else      → standard branching
  ternary      → a ? b : c → one-liner if/else
  &&           → render if truthy (⚠️ 0 bug in React!)
  ||           → fallback if falsy
  ??           → fallback for null/undefined ONLY
  ?.           → safe navigation, returns undefined instead of TypeError

ARRAY METHODS
  .map(fn)         → transform → new array (same length)
  .filter(fn)      → keep matches → new array (shorter/equal)
  .reduce(fn, init)→ collapse → single value (sum, object, array)
  .sort(fn)        → sort IN PLACE — always provide comparator for numbers
  .find(fn)        → first match → element or undefined
  .findIndex(fn)   → index of first match
  .some(fn)        → any match? → boolean
  .every(fn)       → all match? → boolean

EVENT LISTENERS
  onClick   → fires on click  (button, div, etc.)
  onChange  → fires on every keystroke in React (like native 'input')
  onBlur    → fires when element LOSES focus  → use for validation
  onFocus   → fires when element GAINS focus  → use for highlighting/clearing error
  e.target.value → get current input value
  e.preventDefault() → stop default browser action (form reload, link navigate)
  e.stopPropagation() → stop event from bubbling up

BUBBLING & CAPTURING
  Bubbling  → child → parent → grandparent (default)
  Capturing → document → child (use true as 3rd arg)
  Delegation → one parent listener catches all children (via bubbling)
  e.target = actually clicked element
  e.currentTarget = element with the listener

TIMERS
  setTimeout(fn, ms)   → run once after ms
  setInterval(fn, ms)  → run every ms
  clearTimeout(id)     → cancel pending timeout
  clearInterval(id)    → stop interval
  Always clearInterval in useEffect cleanup!

PROMISES
  States: Pending → Fulfilled | Rejected (settled = final)
  .then(result => ...)    → on resolve
  .catch(error => ...)    → on reject
  .finally(() => ...)     → always runs
  Promise.all([])         → all must succeed, parallel
  Promise.allSettled([])  → all run, report each
  Promise.race([])        → first to settle
  Promise.any([])         → first to succeed

ASYNC/AWAIT
  async function always returns Promise
  await pauses the function — not the whole thread
  Execution: sync code → hits await → function pauses → outer continues
  try/catch/finally with await is standard error handling
  Sequential: await A; await B  (when B needs A's result)
  Parallel:   await Promise.all([A, B])  (when independent)

WINDOW OBJECT
  localStorage    → persist across sessions (JSON.stringify/parse objects)
  sessionStorage  → persist per tab session
  location.href   → current URL, set to navigate
  location.reload()→ refresh page
  history.back()  → go back
  innerWidth/Height→ viewport dimensions
  scrollY         → pixels scrolled from top
  navigator.onLine→ internet connected?
  navigator.clipboard.writeText(str) → copy to clipboard
```

---

## 🎯 Top Interview Questions

1. **`var` vs `let` vs `const` — what are all the differences?**
2. **What is the Temporal Dead Zone?**
3. **What is hoisting? How does it differ for `var`, `let`, `function declaration`, and `function expression`?**
4. **What is a closure? Give a React example.**
5. **What is a Higher-Order Function? Name 5 built-in HOFs.**
6. **What is the difference between `&&` and `??` for conditional rendering?**
7. **What is the `0 &&` bug in React? How do you fix it?**
8. **Why does `.sort()` fail with numbers? How do you fix it?**
9. **What is event bubbling? What is event delegation? Why is it better?**
10. **What is `e.target` vs `e.currentTarget`?**
11. **What does `async` function always return?**
12. **Does `await` block the JavaScript thread?**
13. **Why does `fetch` not reject on a 404? How do you handle it?**
14. **What is the difference between `Promise.all`, `allSettled`, `race`, `any`?**
15. **When should you use sequential `await` vs `Promise.all`?**
16. **What is the difference between `localStorage` and `sessionStorage`?**
17. **Why must you never mutate state directly in React? How does spread fix it?**
18. **Write a React state update that removes an item by id from an array.**
19. **Why must React hooks always be at the top level?**
20. **What is `event.preventDefault()`? Give 3 use cases.**

---

> 💡 **Last Thought:** React is 80% JavaScript, 20% React-specific APIs.
> When React confuses you — trace it back to JS:
> - Hooks → closures + scope
> - Props → function params + destructuring
> - State updates → spread + immutability
> - Conditional render → ternary + short-circuit + `??`
> - Lists → `.map()` + `.filter()`
> - Data fetching → async/await + try/catch + `useEffect` cleanup
> - Navigation → `window.history` (React Router wraps this)
> - Storage → `localStorage`
>
> **You already know the building blocks. React is just organizing them.**
