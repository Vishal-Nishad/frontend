# ⚛️ React Core Concepts — Simple Definitions & Examples
> Clean reference for interview prep | No fluff

---

## 1. Components

**What it is:**
A component is just a **JavaScript function that returns JSX** (UI). Your entire React app is a tree of components — big ones made of smaller ones.

```jsx
// A component = a JS function that returns UI
function UserCard({ name, role }) {
    return (
        <div>
            <h2>{name}</h2>
            <p>{role}</p>
        </div>
    );
}

// Use it like an HTML tag
<UserCard name="Vishal" role="Backend Engineer" />
```

**3 things to remember:**
- Name must start with **Uppercase** (`UserCard`, not `userCard`)
- Must return **one root element** (use `<>...</>` if needed)
- Each component = its own file (convention, not rule)

---

## 2. Props

**What it is:**
Props are **inputs to a component** — data passed from parent to child. Like function arguments. They are **read-only** — a child never modifies its own props.

```jsx
// Parent passes props
function App() {
    return <Button label="Submit" color="blue" disabled={false} />;
}

// Child receives and uses props
function Button({ label, color, disabled = false }) {
    return (
        <button style={{ backgroundColor: color }} disabled={disabled}>
            {label}
        </button>
    );
}
```

**Key rules:**
- Props flow **down only** — parent → child
- To send data back **up** → pass a function as prop, child calls it
- Always destructure props for cleaner code

```jsx
// Sending data back up
function Parent() {
    function handleDelete(id) {
        console.log("Delete item:", id); // runs when child calls it
    }
    return <Child itemId={5} onDelete={handleDelete} />;
}

function Child({ itemId, onDelete }) {
    return <button onClick={() => onDelete(itemId)}>Delete</button>;
}
```

---

## 3. Events

**What it is:**
React events are the same as browser events (`click`, `change`, `submit`) — just written in **camelCase** and passed as **functions**.

```jsx
function Form() {
    // Always define handler as a function
    function handleClick() {
        console.log("clicked");
    }

    function handleChange(e) {
        console.log("typed:", e.target.value); // e.target.value = input text
    }

    function handleSubmit(e) {
        e.preventDefault();                    // stop page reload
        console.log("form submitted");
    }

    return (
        <form onSubmit={handleSubmit}>
            <input onChange={handleChange} />
            <button onClick={handleClick}>Click</button>
        </form>
    );
}
```

**The #1 mistake:**
```jsx
// ❌ WRONG — runs immediately on render, not on click
<button onClick={handleClick()}>

// ✅ CORRECT — runs only when clicked
<button onClick={handleClick}>

// ✅ CORRECT — when you need to pass an argument
<button onClick={() => handleDelete(id)}>
```

---

## 4. Hooks

**What it is:**
Hooks are **built-in React functions** starting with `use` that give your component superpowers — like memory (state), side effects, context access, etc.

**Two rules — non-negotiable:**
1. Only call hooks at the **top level** — never inside if/loops
2. Only call hooks inside **React components** — not regular functions

---

### `useState` — Give a Component Memory

**What it is:** Stores a value that, when changed, causes the component to re-render.

```jsx
import { useState } from "react";

function Counter() {
    // [currentValue, functionToUpdateIt] = useState(startingValue)
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
            <button onClick={() => setCount(count - 1)}>-</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
}
// Clicking + → count becomes 1 → component re-renders → UI shows 1
```

**Updating objects/arrays — always use spread:**
```jsx
const [user, setUser] = useState({ name: "Vishal", age: 23 });

// ✅ Correct — create new object
setUser({ ...user, age: 24 });

const [items, setItems] = useState(["a", "b"]);

// ✅ Add
setItems([...items, "c"]);

// ✅ Remove
setItems(items.filter(i => i !== "b"));
```

**Updater function — when new state depends on old state:**
```jsx
// ❌ Risky — `count` might be stale
setCount(count + 1);

// ✅ Safe — prev is always the latest value
setCount(prev => prev + 1);
```

---

### `useEffect` — Run Code After Render

**What it is:** Runs a function **after** the component renders. Used for API calls, subscriptions, timers — anything that talks to the outside world.

```jsx
import { useState, useEffect } from "react";

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);

    // Runs after render — when userId changes
    useEffect(() => {
        console.log("Fetching user...");

        fetch(`https://api.example.com/users/${userId}`)
            .then(res => res.json())
            .then(data => setUser(data));

    }, [userId]); // dependency array — re-runs when userId changes

    if (!user) return <p>Loading...</p>;
    return <h2>{user.name}</h2>;
}
```

**The 3 forms of `useEffect`:**
```jsx
// 1. No dependency array — runs after EVERY render
useEffect(() => {
    console.log("runs every render");
});

// 2. Empty array [] — runs ONCE after first render (like componentDidMount)
useEffect(() => {
    console.log("runs once on mount");
    fetchInitialData();
}, []);

// 3. With dependencies — runs when those values change
useEffect(() => {
    console.log("userId changed, fetch new user");
    fetchUser(userId);
}, [userId]);
```

**Cleanup — stop timers/subscriptions when component unmounts:**
```jsx
useEffect(() => {
    const timer = setInterval(() => {
        console.log("tick");
    }, 1000);

    // Cleanup runs when component is removed from page
    return () => clearInterval(timer);
}, []);
```

**Console output pattern:**
```
// On first render:
"runs once on mount"

// On unmount (component removed):
// cleanup function runs → timer cleared
```

---

### `useRef` — Reference a DOM Element or Persist a Value

**What it is:** Gives you a direct reference to a DOM element OR stores a value that persists across renders **without causing a re-render**.

```jsx
import { useRef } from "react";

function SearchBar() {
    const inputRef = useRef(null);

    function handleFocus() {
        inputRef.current.focus(); // directly access the DOM element
        console.log("Input value:", inputRef.current.value);
    }

    return (
        <div>
            <input ref={inputRef} type="text" placeholder="Search..." />
            <button onClick={handleFocus}>Focus Input</button>
        </div>
    );
}
```

**`useRef` vs `useState`:**
| | `useState` | `useRef` |
|--|-----------|---------|
| Causes re-render? | ✅ Yes | ❌ No |
| Use for | UI values that show on screen | DOM access, timers, counters that don't need UI update |

---

### `useContext` — Access Global Data Without Prop Drilling

**What it is:** Lets any component read shared data (theme, user, language) without passing props through every level.

```jsx
import { createContext, useContext, useState } from "react";

// 1. Create context
const ThemeContext = createContext("light");

// 2. Provide it high up in the tree
function App() {
    const [theme, setTheme] = useState("dark");

    return (
        <ThemeContext.Provider value={theme}>
            <Navbar />
            <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
                Toggle Theme
            </button>
        </ThemeContext.Provider>
    );
}

// 3. Consume anywhere in the tree — no prop drilling
function Navbar() {
    const theme = useContext(ThemeContext);
    console.log("Current theme:", theme);

    return (
        <nav style={{ background: theme === "dark" ? "#333" : "#fff" }}>
            Navbar
        </nav>
    );
}
// Console: "Current theme: dark"
// Toggle clicked → "Current theme: light"
```

---

### `useMemo` — Cache an Expensive Calculation

**What it is:** Remembers the result of a calculation and only recomputes when its dependencies change. Avoids doing heavy work on every render.

```jsx
import { useState, useMemo } from "react";

function ProductList({ products, searchTerm }) {
    // Without useMemo — filters on EVERY render (even unrelated renders)
    // const filtered = products.filter(p => p.name.includes(searchTerm));

    // With useMemo — only re-filters when products or searchTerm changes
    const filtered = useMemo(() => {
        console.log("Filtering products...");
        return products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    return <ul>{filtered.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
// Console: "Filtering products..." — only when searchTerm or products change
// Not on every parent re-render
```

---

### `useCallback` — Cache a Function

**What it is:** Same idea as `useMemo` but for functions — returns the same function reference across renders unless dependencies change.

```jsx
import { useState, useCallback } from "react";

function Parent() {
    const [count, setCount] = useState(0);

    // Without useCallback — new function created on every render
    // With useCallback — same function reference unless count changes
    const handleDelete = useCallback((id) => {
        console.log("Deleting:", id);
        // setItems(prev => prev.filter(i => i.id !== id))
    }, []); // no dependencies — function never changes

    return (
        <div>
            <p>{count}</p>
            <button onClick={() => setCount(c => c + 1)}>Re-render Parent</button>
            <Child onDelete={handleDelete} />
        </div>
    );
}
```

> **Honest take:** Don't over-use `useMemo`/`useCallback`. Add them only when you notice performance problems — not by default.

---

## 5. Closure in React

**What it is:**
A closure is when a function **remembers variables from the scope it was created in** — even after that outer function has finished.

```js
// Pure JS closure
function makeCounter() {
    let count = 0;              // outer variable

    return function() {         // inner function
        count++;                // remembers count — closure!
        console.log(count);
    };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
counter(); // 3  ← count is alive and remembered
```

**In React — every event handler is a closure:**
```jsx
function Counter() {
    const [count, setCount] = useState(0);

    // handleClick closes over `count`
    // It remembers count's value at the time it was created
    function handleClick() {
        console.log("count is:", count); // reads count via closure
        setCount(count + 1);
    }

    return <button onClick={handleClick}>Count: {count}</button>;
}
```

**The stale closure bug:**
```jsx
// ❌ Problem — setInterval closes over count=0, never sees updates
useEffect(() => {
    const id = setInterval(() => {
        setCount(count + 1);           // count is always 0 here — stale!
        console.log("count:", count);  // always logs 0
    }, 1000);
    return () => clearInterval(id);
}, []);

// ✅ Fix — use updater function, always gets fresh value
useEffect(() => {
    const id = setInterval(() => {
        setCount(prev => prev + 1);    // prev = latest value ✅
    }, 1000);
    return () => clearInterval(id);
}, []);
```

---

## 🔁 One-Line Definitions — for Quick Revision

```
Component   → JS function that returns JSX (UI)
Props       → read-only inputs passed from parent to child
Events      → camelCase handlers passed as functions (onClick, onChange)
useState    → stores a value; changing it re-renders the component
useEffect   → runs code after render; used for API calls, timers
useRef      → direct DOM access or persist value without re-render
useContext  → read shared global data without passing props everywhere
useMemo     → cache expensive calculation result
useCallback → cache a function reference
Closure     → function remembers variables from where it was created
Stale closure → closure holds old state value in async/interval code
```

---

## 🎯 10 Interview Questions

1. What is a React component?
2. What are props? Can a child modify its own props?
3. What is the difference between `onClick={fn}` and `onClick={fn()}`?
4. What does `useState` return? What happens when you call the setter?
5. What are the 3 forms of `useEffect`? What does the dependency array do?
6. What is the difference between `useRef` and `useState`?
7. What is `useContext` used for? What problem does it solve?
8. What is a closure? Give a simple example.
9. What is a stale closure in React? How do you fix it?
10. What are the two rules of hooks?
