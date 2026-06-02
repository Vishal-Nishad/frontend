# 📘 React Part 3 — Events, State, Hooks & Closures
> **Interview-Ready** | Simple & Accurate | Backend Engineer Perspective

---

## 1. Events in React

> React events work exactly like DOM events — but written in **camelCase** and passed as **functions**, not strings.

### Click Event

```jsx
// Button.jsx
function Button() {
    // Define handler as a function
    function handleClick() {
        console.log("Button was clicked!");
        alert("Clicked!");
    }

    return (
        // Pass function REFERENCE — not invocation
        <button onClick={handleClick}>Click Me</button>
        // ✅ onClick={handleClick}   — correct
        // ❌ onClick={handleClick()} — WRONG, runs on render, not on click
    );
}

export default Button;
```

### Inline Handler (for simple logic)

```jsx
function Button() {
    return (
        <button onClick={() => console.log("clicked!")}>
            Click Me
        </button>
    );
}
```

### Passing Arguments to Handlers

```jsx
function ProductCard({ id, name }) {
    function handleDelete(productId) {
        console.log("Deleting product:", productId);
    }

    return (
        <div>
            <p>{name}</p>
            {/* Wrap in arrow fn to pass args */}
            <button onClick={() => handleDelete(id)}>Delete</button>
        </div>
    );
}
```

### Form Events

```jsx
// Form.jsx
function Form() {
    function handleSubmit(event) {
        event.preventDefault(); // stop page reload — same as vanilla JS
        console.log("Form submitted");
    }

    function handleChange(event) {
        console.log("Typed:", event.target.value); // get input value
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                onChange={handleChange}   // fires on every keystroke
                onFocus={() => console.log("Input focused")}
                onBlur={() => console.log("Input lost focus")}
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default Form;
```

### Console Output (on typing "hi" then clicking away)
```
Input focused
Typed: h
Typed: hi
Input lost focus
```

### 💬 Interview Q: What is the difference between `onClick={fn}` and `onClick={fn()}`?

> `onClick={fn}` → passes the function itself — React calls it when clicked ✅  
> `onClick={fn()}` → **calls the function immediately** during render, assigns its return value to onClick ❌  
> Rule: always pass a reference or an arrow function — never invoke directly.

---

## 2. State in React — `useState`

> **State** is data that belongs to a component and can change over time.
> When state changes → React **automatically re-renders** the component.

### Why Not Just Use a Variable?

```jsx
// ❌ This does NOT work — React doesn't know the variable changed
function Counter() {
    let count = 0;

    function increment() {
        count = count + 1;
        console.log(count); // count updates in JS — but UI never changes!
    }

    return <button onClick={increment}>Count: {count}</button>;
}
// Problem: React only re-renders when STATE changes — not regular variables
```

### `useState` — The Fix

```jsx
// Counter.jsx
import { useState } from "react";

function Counter() {
    // useState returns [currentValue, setterFunction]
    const [count, setCount] = useState(0); // 0 = initial value

    function increment() {
        setCount(count + 1); // tells React: "state changed, re-render"
    }

    function decrement() {
        setCount(count - 1);
    }

    function reset() {
        setCount(0);
    }

    console.log("Component rendered, count =", count);

    return (
        <div>
            <h2>Count: {count}</h2>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}

export default Counter;
```

### Console Output (clicking + twice, then reset)
```
Component rendered, count = 0    ← initial render
Component rendered, count = 1    ← after first +
Component rendered, count = 2    ← after second +
Component rendered, count = 0    ← after reset
```

> Every time `setCount` is called → component function runs again from top → UI updates.

### useState with Different Types

```jsx
import { useState } from "react";

function Examples() {
    const [name, setName]         = useState("");          // string
    const [age, setAge]           = useState(0);           // number
    const [isActive, setIsActive] = useState(false);       // boolean
    const [user, setUser]         = useState(null);        // null
    const [items, setItems]       = useState([]);          // array
    const [config, setConfig]     = useState({ theme: "dark" }); // object

    return (
        <div>
            <input
                value={name}
                onChange={e => setName(e.target.value)} // update string state
            />
            <button onClick={() => setIsActive(!isActive)}>
                {isActive ? "Active" : "Inactive"}
            </button>
        </div>
    );
}
```

### Updating Object State — Always Spread

```jsx
const [user, setUser] = useState({ name: "Vishal", age: 23, city: "Delhi" });

// ❌ WRONG — mutates existing object, React may not re-render
user.age = 24;
setUser(user);

// ✅ CORRECT — create new object with spread
setUser({ ...user, age: 24 });
// Result: { name: "Vishal", age: 24, city: "Delhi" }
```

### Updating Array State

```jsx
const [items, setItems] = useState(["apple", "banana"]);

// Add item
setItems([...items, "cherry"]);         // ["apple", "banana", "cherry"]

// Remove item
setItems(items.filter(i => i !== "banana")); // ["apple"]

// Update item
setItems(items.map(i => i === "apple" ? "mango" : i)); // ["mango", "banana"]
```

---

## 3. Hooks — What They Are

> **Hooks** are special React functions that start with `use`.
> They let functional components do things that previously required class components — like managing state.

```jsx
// Common hooks you'll use:
import { useState }   from "react"; // manage component state
import { useEffect }  from "react"; // run code on render/unmount (API calls)
import { useContext }  from "react"; // access global data
import { useRef }      from "react"; // reference a DOM element
```

### Rules of Hooks — Must Know for Interview

```jsx
// ✅ Rule 1: Only call hooks at the TOP LEVEL of a component
function MyComponent() {
    const [count, setCount] = useState(0); // ✅ top level

    // ❌ WRONG — hook inside condition
    if (count > 0) {
        const [x, setX] = useState(0); // ❌ breaks React
    }

    // ❌ WRONG — hook inside loop
    for (let i = 0; i < 3; i++) {
        const [y, setY] = useState(0); // ❌ breaks React
    }
}

// ✅ Rule 2: Only call hooks inside React functions
// Not in regular JS functions, not in class components
function regularFunction() {
    const [x, setX] = useState(0); // ❌ not a React component or custom hook
}
```

### 💬 Interview Q: Why can't hooks be inside conditions or loops?

> React tracks hooks by their **order of calls** on every render. If a hook is inside a condition, it might be called on some renders and not others — the order changes and React loses track of which state belongs to which hook.

---

## 4. Closure in React — Why It Matters

> A **closure** is when an inner function remembers variables from its outer scope even after the outer function has finished.

### Basic Closure (JS Concept)

```js
function outer() {
    let b = 10;

    function inner() {
        let a = 20;
        console.log(a + b); // inner remembers `b` from outer scope
    }

    return inner;
}

let innerFn = outer(); // outer() is done, but `b` is still remembered
innerFn();             // Console: 30 ✅ — closure kept `b` alive
```

### How Closures Work in React Event Handlers

```jsx
import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);

    // handleClick "closes over" count — remembers its current value
    function handleClick() {
        console.log("Current count:", count); // reads count via closure
        setCount(count + 1);
    }

    return <button onClick={handleClick}>Count: {count}</button>;
}
```

> `handleClick` is defined inside `Counter`. It **closes over** `count` — remembers the value of `count` at the time it was created. Every time the component re-renders, a new `handleClick` is created with the new `count` value.

### The Stale Closure Bug — Important Interview Topic

```jsx
import { useState, useEffect } from "react";

function Timer() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            // ❌ Stale closure — this function closed over count=0
            // count never updates inside here, always logs 0
            console.log("count is:", count); // always 0!
            setCount(count + 1);             // always sets to 0+1 = 1!
        }, 1000);

        return () => clearInterval(interval);
    }, []); // empty dependency — effect runs once, closes over initial count=0

    return <p>{count}</p>; // count stuck at 1 forever
}
```

```jsx
// ✅ Fix — use updater function (callback form of setState)
useEffect(() => {
    const interval = setInterval(() => {
        setCount(prev => prev + 1); // prev = always the LATEST value ✅
    }, 1000);

    return () => clearInterval(interval);
}, []);
// Now count correctly increments: 0, 1, 2, 3...
```

---

## 5. Re-render — How It Works

> React re-renders a component when:
> 1. Its **state changes** (via `setState`)
> 2. Its **props change** (parent re-renders with new data)

```jsx
import { useState } from "react";

function Parent() {
    const [name, setName] = useState("Vishal");

    console.log("Parent rendered");

    return (
        <div>
            <button onClick={() => setName("Hela")}>Change Name</button>
            <Child name={name} />
        </div>
    );
}

function Child({ name }) {
    console.log("Child rendered");
    return <p>Hello, {name}</p>;
}
```

### Console Output (initial load, then clicking button)
```
Parent rendered     ← initial
Child rendered      ← initial

Parent rendered     ← after button click (state changed)
Child rendered      ← re-renders because prop `name` changed
```

### What React Does on Re-render

```
1. State/prop changes
2. Component function runs again (top to bottom)
3. React compares new JSX with previous JSX (Virtual DOM diffing)
4. Only updates the ACTUAL DOM parts that changed
→ This is why React is fast — not re-painting the whole page
```

---

## 6. Updater Function in `setState` — Callback Form

> When new state **depends on the previous state** — always use the updater function form.

### The Problem

```jsx
function Counter() {
    const [count, setCount] = useState(0);

    function handleTripleIncrement() {
        // ❌ All 3 use the SAME `count` value (stale closure)
        setCount(count + 1); // count=0, sets to 1
        setCount(count + 1); // count=0 still! sets to 1 again
        setCount(count + 1); // count=0 still! sets to 1 again
        // Result: count becomes 1, not 3 ❌
    }

    return <button onClick={handleTripleIncrement}>+3 (broken)</button>;
}
```

### The Fix — Updater Function

```jsx
function Counter() {
    const [count, setCount] = useState(0);

    function handleTripleIncrement() {
        // ✅ Each call receives the LATEST state as `prev`
        setCount(prev => prev + 1); // prev=0, sets to 1
        setCount(prev => prev + 1); // prev=1, sets to 2
        setCount(prev => prev + 1); // prev=2, sets to 3
        // Result: count becomes 3 ✅
    }

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={handleTripleIncrement}>+3</button>
        </div>
    );
}
```

### Console Output (clicking +3)
```
Component rendered, count = 0    ← initial
Component rendered, count = 3    ← after click (React batches the 3 setState calls)
```

### Rule — When to Use Updater Function

```jsx
// ✅ Use updater when new state depends on previous state
setCount(prev => prev + 1);
setItems(prev => [...prev, newItem]);
setUser(prev => ({ ...prev, age: prev.age + 1 }));

// ✅ Direct value is fine when NOT dependent on previous state
setName("Hela");          // just setting a new value
setIsActive(true);        // not based on previous value
setCount(0);              // reset — not based on previous
```

---

## 🏭 Production Example — All Concepts Together

```jsx
// A simple cart counter using all concepts from Part 3

import { useState } from "react";

function CartButton({ productId, productName }) {
    const [quantity, setQuantity] = useState(0);
    const [isAdded, setIsAdded]   = useState(false);

    function handleAdd() {
        setQuantity(prev => prev + 1); // updater fn — depends on prev
        setIsAdded(true);
        console.log(`Added ${productName} | Qty: ${quantity + 1}`);
    }

    function handleRemove() {
        if (quantity === 0) return; // guard clause
        setQuantity(prev => prev - 1);
        if (quantity === 1) setIsAdded(false); // last item removed
    }

    return (
        <div>
            <p>{productName}</p>

            {/* Conditional render based on state */}
            {!isAdded ? (
                <button onClick={handleAdd}>Add to Cart</button>
            ) : (
                <div>
                    <button onClick={handleRemove}>−</button>
                    <span> {quantity} </span>
                    <button onClick={handleAdd}>+</button>
                </div>
            )}
        </div>
    );
}
```

### Console Output (Add → +  → +)
```
Added Laptop | Qty: 1
Added Laptop | Qty: 2
Added Laptop | Qty: 3
```

---

## 🔁 Quick Cheatsheet

```
EVENTS
  onClick={fn}       → pass reference, not fn()
  onClick={() => fn(arg)} → when you need to pass args
  event.preventDefault() → stop form reload
  event.target.value     → get input value

useState
  const [value, setValue] = useState(initialValue)
  setValue(newValue)       → triggers re-render
  setValue(prev => ...)    → use when new state needs old state

HOOKS RULES
  1. Only at TOP LEVEL — not in if/else/loops
  2. Only in React functions — not regular JS functions

CLOSURE IN REACT
  Event handlers "close over" current state values
  Stale closure = using old state in async code (setTimeout, setInterval)
  Fix = use updater function: setState(prev => prev + 1)

RE-RENDER TRIGGERS
  State changes  → useState setter called
  Props change   → parent re-renders with new data
  React diffs the Virtual DOM → only updates changed parts

UPDATER FUNCTION
  setCount(prev => prev + 1)   → safe when depending on previous state
  setItems(prev => [...prev, x]) → safe array update
  Use when: multiple updates in one handler, async code, intervals
```

---

## 🎯 Interview Questions from This Part

1. **What is `useState`? What does it return?**
2. **Why can't you use a regular variable instead of state?**
3. **What triggers a re-render in React?**
4. **What are the two rules of hooks?**
5. **What is a closure? How does it relate to event handlers in React?**
6. **What is a stale closure? Give an example in React.**
7. **What is the updater function form of `setState`? When should you use it?**
8. **What is the difference between `setCount(count+1)` and `setCount(prev => prev+1)`?**
9. **What is `event.preventDefault()` used for in React forms?**
10. **What is the Virtual DOM? How does re-rendering work?**

---

> 💡 **Backend Analogy:**
> `useState` is like a database row for a single component.
> `setValue` is like an UPDATE query — it changes the value AND triggers a refresh (re-render).
> Just as your FastAPI endpoint returns updated data after a DB write, React re-renders the UI after a state write. The component is just a function that maps state → UI output.
