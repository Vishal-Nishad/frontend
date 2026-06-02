# 📘 React Part 1 — JSX, Components & Styling
> **Interview-Ready Reference** | 20+ LPA Product-Based Prep | Backend Engineer → Full Stack

---

## 🗺️ Mental Model Before You Start

> React is a **UI library** — it solves one problem: building component trees that automatically update when data changes.

```
Your App
│
├── App.jsx                  ← root component, orchestrates everything
│   ├── Navbar.jsx           ← independent UI piece
│   ├── ProductList.jsx      ← renders list of ProductCard
│   │   ├── ProductCard.jsx  ← single card
│   │   └── ProductCard.jsx
│   └── Footer.jsx

Each .jsx file = one component = one reusable UI piece
Data flows DOWN (parent → child via props)
Events flow UP (child → parent via callback props)
```

---

## 1. What is JSX?

> **JSX (JavaScript XML)** is a syntax extension that lets you write HTML-like code directly inside JavaScript. It is **NOT HTML** — it compiles to `React.createElement()` calls under the hood.

### JSX vs What the Browser Actually Sees

```jsx
// ✅ What YOU write (JSX)
function Welcome() {
    return (
        <div className="card">
            <h1>Hello Vishal</h1>
            <p>Welcome to React</p>
        </div>
    );
}
```

```js
// ✅ What BABEL compiles it to (what JS engine actually runs)
function Welcome() {
    return React.createElement(
        "div",
        { className: "card" },
        React.createElement("h1", null, "Hello Vishal"),
        React.createElement("p",  null, "Welcome to React")
    );
}
```

> JSX is **100% optional** — but without it, you'd write `React.createElement` for every element. JSX makes React usable.

### JSX Returns a React Element (an Object)

```jsx
const element = <h1>Hello</h1>;
console.log(element);
// {
//   type: "h1",
//   props: { children: "Hello" },
//   key: null,
//   ref: null,
//   ...
// }
// It's just a plain JS object describing what to render
```

### 💬 Interview Q: What is JSX? Is it valid JavaScript?

> **Answer:** JSX is a syntax extension for JavaScript that resembles HTML. It is **not** valid JavaScript by itself — it must be **transpiled** (by Babel/Vite) into `React.createElement()` calls before the browser can run it. JSX exists purely as developer convenience — it compiles away completely before shipping.

### 💬 Interview Q: What is the difference between JSX and HTML?

| HTML | JSX |
|------|-----|
| `class="btn"` | `className="btn"` |
| `for="email"` | `htmlFor="email"` |
| `onclick="fn()"` | `onClick={fn}` |
| Self-close optional `<br>` | Self-close required `<br />` |
| Case insensitive | Case sensitive (`<div>` vs `<Div>`) |
| Attributes are strings | Attributes can be JS expressions |

---

## 2. Import / Export — The Module System React Lives On

> Every React file is a **module**. Components, hooks, utilities — all imported/exported between files.

### Named Export — Multiple Things from One File

```jsx
// 📁 utils/helpers.js

// named exports — explicit names
export const API_URL = "https://api.example.com";

export function formatPrice(price) {
    return `₹${price.toLocaleString("en-IN")}`;
}

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export class UserService {
    static getUser(id) { return fetch(`/api/users/${id}`); }
}
```

```jsx
// 📁 App.jsx — importing named exports

// Must use EXACT names (or alias with `as`)
import { API_URL, formatPrice, capitalize } from "./utils/helpers";

// Alias on import
import { formatPrice as fp } from "./utils/helpers";

// Import everything as namespace object
import * as Helpers from "./utils/helpers";
Helpers.formatPrice(1999); // ₹1,999

console.log(API_URL);         // "https://api.example.com"
console.log(formatPrice(1999));// "₹1,999"
console.log(capitalize("hello")); // "Hello"
```

---

### Default Export — One Main Thing per File

```jsx
// 📁 components/Button.jsx

// Only ONE default export per file
const Button = ({ label, onClick, variant = "primary" }) => {
    return (
        <button className={`btn btn-${variant}`} onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;
```

```jsx
// 📁 App.jsx — importing default export

// Name can be ANYTHING — it's the default
import Button from "./components/Button";
import Btn   from "./components/Button"; // same thing, different name ✅
```

---

### Mixing Default + Named in One File (Most Common Pattern)

```jsx
// 📁 components/Card.jsx

// Named export — a constant specific to this file
export const CARD_VARIANTS = ["default", "outlined", "filled"];

// Named export — a utility function
export function getCardClass(variant) {
    return `card card-${variant}`;
}

// Default export — the main component
const Card = ({ title, body, variant = "default" }) => {
    return (
        <div className={getCardClass(variant)}>
            <h3>{title}</h3>
            <p>{body}</p>
        </div>
    );
};

export default Card;
```

```jsx
// 📁 App.jsx
import Card, { CARD_VARIANTS, getCardClass } from "./components/Card";
//     ↑ default    ↑ named exports
```

---

### Re-exporting — Barrel Files (Production Pattern)

```jsx
// 📁 components/index.js — barrel file
// Instead of importing from each file individually...
export { default as Button }   from "./Button";
export { default as Card }     from "./Card";
export { default as Navbar }   from "./Navbar";
export { CARD_VARIANTS }       from "./Card";

// Now in App.jsx — clean single import
import { Button, Card, Navbar, CARD_VARIANTS } from "./components";
// vs the messy way:
// import Button from "./components/Button";
// import Card   from "./components/Card";
// import Navbar from "./components/Navbar";
```

### Default vs Named — When to Use Which

| | Named Export | Default Export |
|--|-------------|----------------|
| Syntax | `export const x = ...` | `export default x` |
| Import | `import { x } from "..."` | `import x from "..."` |
| Per file | Multiple ✅ | ONE only |
| Auto-rename? | Must use `as` | Any name works ✅ |
| Tree-shaking | ✅ Better | ✅ Good |
| Best for | Utilities, constants, types | Components, classes, main export |

### 💬 Interview Q: What is tree shaking? How do imports affect it?

> **Answer:** Tree shaking is the bundler's (Webpack/Vite) process of removing unused code from the final bundle. Named exports enable better tree shaking — if you only import `{ formatPrice }`, the bundler can exclude everything else in that file. Default exports are harder to tree-shake because the bundler can't always tell which parts are used.

---

## 3. Rules for Writing Markup in JSX

### Rule 1: Return a Single Root Element

```jsx
// ❌ Error — two sibling root elements
function Wrong() {
    return (
        <h1>Title</h1>
        <p>Body</p>   // JSX expressions must have one parent element
    );
}

// ✅ Option 1 — wrap in a <div>
function WithDiv() {
    return (
        <div>
            <h1>Title</h1>
            <p>Body</p>
        </div>
    );
}

// ✅ Option 2 — use Fragment (no extra DOM node) — PREFERRED
function WithFragment() {
    return (
        <>
            <h1>Title</h1>
            <p>Body</p>
        </>
    );
}

// ✅ Option 3 — explicit Fragment (when you need a key prop)
import { Fragment } from "react";
function WithKeyedFragment() {
    return items.map(item => (
        <Fragment key={item.id}>
            <dt>{item.term}</dt>
            <dd>{item.def}</dd>
        </Fragment>
    ));
}
```

### 💬 Interview Q: Why does JSX require one root element?

> **Answer:** JSX compiles to `React.createElement(type, props, ...children)`. A function can only return **one value**. Two sibling elements would be two separate `createElement` calls — a function can't return two values simultaneously. Fragment solves this by wrapping them in a `<React.Fragment>` which renders nothing in the actual DOM.

---

### Rule 2: Close ALL Tags

```jsx
// ❌ Error — HTML allows unclosed tags, JSX does NOT
<img src="photo.jpg">
<br>
<input type="text">

// ✅ All tags must be self-closed or explicitly closed
<img src="photo.jpg" />
<br />
<input type="text" />

// Regular elements must close too
<div></div>
<p>text</p>
```

---

### Rule 3: Use `camelCase` for Most HTML Attributes

```jsx
// HTML attribute    →    JSX attribute
// class             →    className
// for               →    htmlFor
// tabindex          →    tabIndex
// onclick           →    onClick
// onmouseenter      →    onMouseEnter
// bgcolor           →    bgColor (deprecated anyway)
// stroke-width      →    strokeWidth (SVG)

// ✅ Correct JSX
<div className="container">
    <label htmlFor="email">Email</label>
    <input
        id="email"
        type="email"
        tabIndex={0}
        onChange={handleChange}
    />
</div>
```

---

### Rule 4: Uppercase for React Components, Lowercase for HTML Tags

```jsx
// Lowercase = native HTML element
<div>    <p>    <button>    <input>

// Uppercase = React Component
<Button>    <UserCard>    <Navbar>    <ProductList>

// Why this matters:
<button />   // React renders native HTML <button>
<Button />   // React looks for a component named Button, calls its function

// ❌ Error — React sees lowercase as HTML tag, not your component
function myComponent() { return <p>hi</p>; }
<myComponent />  // renders nothing or errors

// ✅ Always start component names with uppercase
function MyComponent() { return <p>hi</p>; }
<MyComponent />  // ✅ correctly identified as a component
```

---

### Rule 5: JSX Expressions in `{}`

```jsx
// Anything JS-expressionable goes in {}
// ✅ Valid inside JSX: string, number, array, function call, ternary, &&
// ❌ NOT valid: if/else, for loops, variable declarations

function Product({ name, price, discount }) {
    const finalPrice = price - (price * discount / 100);

    return (
        <div>
            <h2>{name}</h2>                           {/* variable */}
            <p>₹{finalPrice.toFixed(2)}</p>           {/* expression */}
            <p>{discount > 0 ? "On Sale!" : "Full Price"}</p> {/* ternary */}
            {discount > 0 && <span className="badge">-{discount}%</span>} {/* && */}
        </div>
    );
}
```

---

### Rule 6: JavaScript Keywords Are Reserved — Use JSX Equivalents

```jsx
// ❌ `class` is a JS keyword
<div class="box">       // ❌
<div className="box">   // ✅

// ❌ `for` is a JS keyword  
<label for="name">      // ❌
<label htmlFor="name">  // ✅

// ❌ style must be an OBJECT, not a string
<div style="color: red">          // ❌ HTML syntax, not JSX
<div style={{ color: "red" }}>    // ✅ object inside {}
```

---

## 4. JSX with Curly Braces `{}` — Using JS Logic in JSX

> `{}` is the **escape hatch** from JSX back into JavaScript. Anything that evaluates to a value can go inside `{}`.

### Variables and Expressions

```jsx
function UserCard() {
    const name    = "Vishal Sharma";
    const age     = 23;
    const isAdmin = true;
    const score   = 94.5;

    return (
        <div className="user-card">
            {/* Variables */}
            <h2>{name}</h2>
            <p>Age: {age}</p>

            {/* Expressions */}
            <p>Score: {score.toFixed(1)}</p>
            <p>Category: {age >= 18 ? "Adult" : "Minor"}</p>
            <p>Name length: {name.length} characters</p>

            {/* Function calls */}
            <p>Upper: {name.toUpperCase()}</p>
            <p>First name: {name.split(" ")[0]}</p>

            {/* Conditional rendering */}
            {isAdmin && <span className="badge">Admin</span>}
        </div>
    );
}
```

### Dynamic Attributes

```jsx
function Avatar({ src, alt, size = "medium", isOnline }) {
    const sizeMap = { small: 32, medium: 64, large: 128 };
    const imgSize = sizeMap[size];

    return (
        <div className="avatar-wrapper">
            {/* Dynamic attribute values */}
            <img
                src={src}
                alt={alt}
                width={imgSize}
                height={imgSize}
                className={`avatar avatar-${size}`}
            />
            {/* Dynamic className */}
            <span className={`status-dot ${isOnline ? "online" : "offline"}`} />
        </div>
    );
}
```

### Inline Styles — Object Syntax

```jsx
function ProgressBar({ percentage, color = "#4CAF50" }) {
    // style prop takes a JS OBJECT — not a CSS string
    const barStyle = {
        width: `${percentage}%`,    // template literal for dynamic value
        backgroundColor: color,     // camelCase property names
        height: "8px",
        borderRadius: "4px",
        transition: "width 0.3s ease"
    };

    return (
        <div style={{ backgroundColor: "#eee", borderRadius: "4px" }}>
            {/* {{ }} — outer {} = JSX expression, inner {} = JS object */}
            <div style={barStyle} />
        </div>
    );
}
```

### Arrays in JSX — Render Lists

```jsx
function TagList({ tags }) {
    return (
        <div className="tags">
            {/* Arrays of JSX are rendered as siblings */}
            {tags.map((tag, index) => (
                <span key={index} className="tag">
                    {tag}
                </span>
            ))}
        </div>
    );
}

// Usage: <TagList tags={["React", "JavaScript", "FastAPI"]} />
// Renders: <span>React</span><span>JavaScript</span><span>FastAPI</span>
```

### What CAN and CANNOT Go in `{}`

```jsx
// ✅ CAN go in {} — evaluates to a value
{name}                          // variable
{42}                            // number
{"hello"}                       // string
{isActive ? "Yes" : "No"}       // ternary
{user && <Profile />}           // short-circuit
{items.map(i => <Item {...i}/>)} // array/map
{formatDate(user.createdAt)}    // function call
{Math.random().toFixed(2)}      // expression

// ❌ CANNOT go in {} — statements, not expressions
{if (x) { ... }}                // ❌ if is a statement
{for (let i ...) { ... }}       // ❌ for loop is a statement
{let x = 5}                     // ❌ variable declaration

// ✅ Workaround — compute BEFORE return
function Component({ score }) {
    // Do your logic BEFORE the return
    let grade;
    if (score >= 90)      grade = "A";
    else if (score >= 75) grade = "B";
    else                  grade = "C";

    const items = [1, 2, 3].map(n => <li key={n}>{n}</li>);

    return (
        <div>
            <p>Grade: {grade}</p>     {/* use result */}
            <ul>{items}</ul>          {/* use pre-built array */}
        </div>
    );
}
```

### 💬 Interview Q: Why can't you use `if/else` directly inside JSX?

> **Answer:** JSX compiles to function calls — `React.createElement(type, props, children)`. The `children` argument must be a **value** (an expression). `if/else` is a **statement** — it doesn't produce a value. Solutions: ternary operator (it IS an expression), pre-compute before return, or extract into a function that returns JSX.

---

## 5. Structuring Components — The Full Mental Model

### Project File Structure (Standard)

```
my-react-app/
│
├── public/
│   └── index.html          ← single HTML file React mounts into
│
├── src/
│   ├── main.jsx            ← entry point, mounts App into DOM
│   ├── App.jsx             ← root component
│   │
│   ├── components/         ← reusable, dumb UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Navbar.jsx
│   │   └── index.js        ← barrel file
│   │
│   ├── pages/              ← route-level components
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   └── Profile.jsx
│   │
│   ├── hooks/              ← custom hooks
│   │   └── useFetch.js
│   │
│   ├── utils/              ← pure JS helpers
│   │   └── helpers.js
│   │
│   └── assets/             ← images, fonts, etc.
│
├── package.json
└── vite.config.js          ← bundler config
```

---

### Layer 1: Base/Leaf Component (no children, just props)

```jsx
// 📁 src/components/ProductCard.jsx

// A base component — takes props, renders UI, no children components
const ProductCard = ({ id, name, price, imageUrl, inStock, onAddToCart }) => {
    return (
        <div className="product-card">
            <img src={imageUrl} alt={name} />
            <h3>{name}</h3>
            <p className="price">₹{price.toLocaleString("en-IN")}</p>
            <p className={`stock ${inStock ? "in-stock" : "out-of-stock"}`}>
                {inStock ? "In Stock" : "Out of Stock"}
            </p>
            <button
                onClick={() => onAddToCart(id)}   // callback up to parent
                disabled={!inStock}
            >
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;
```

---

### Layer 2: Container Component (uses multiple base components)

```jsx
// 📁 src/components/ProductList.jsx
import ProductCard from "./ProductCard"; // import base component

const ProductList = ({ products, onAddToCart }) => {
    // Handle empty state
    if (!products || products.length === 0) {
        return <p className="empty-msg">No products found.</p>;
    }

    return (
        <section className="product-grid">
            <h2>Products ({products.length})</h2>
            {/* Compose multiple ProductCard components */}
            {products.map(product => (
                <ProductCard
                    key={product.id}           // required by React for lists
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    inStock={product.inStock}
                    onAddToCart={onAddToCart}   // pass callback down
                />
            ))}
        </section>
    );
};

export default ProductList;
```

---

### Layer 3: Page Component (owns state, orchestrates containers)

```jsx
// 📁 src/pages/Home.jsx
import { useState, useEffect } from "react";
import ProductList from "../components/ProductList";
import Navbar      from "../components/Navbar";

const Home = () => {
    // State lives at the level that needs it
    const [products, setProducts]   = useState([]);
    const [cart, setCart]           = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data on mount
    useEffect(() => {
        fetch("https://api.example.com/products")
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setIsLoading(false);
            });
    }, []);

    // Handler defined here — passed as prop to child
    const handleAddToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        setCart(prev => [...prev, product]);
        console.log(`Added ${product.name} to cart`);
    };

    if (isLoading) return <div className="spinner">Loading...</div>;

    return (
        <>
            <Navbar cartCount={cart.length} />
            <main>
                <ProductList
                    products={products}
                    onAddToCart={handleAddToCart}
                />
            </main>
        </>
    );
};

export default Home;
```

---

### Layer 4: App.jsx — Root (routing, global providers)

```jsx
// 📁 src/App.jsx
import Home     from "./pages/Home";
import Products from "./pages/Products";
import Profile  from "./pages/Profile";

// In a real app, you'd use React Router here
function App() {
    return (
        <div className="app">
            <Home />
        </div>
    );
}

export default App;
```

---

### Layer 5: main.jsx — Entry Point (mounts React into HTML)

```jsx
// 📁 src/main.jsx
import React    from "react";
import ReactDOM from "react-dom/client";
import App      from "./App";
import "./index.css"; // global CSS

// Find the <div id="root"> in index.html and mount React there
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

```html
<!-- 📁 public/index.html — the ONLY html file in React -->
<!DOCTYPE html>
<html>
    <body>
        <div id="root"></div>  <!-- React mounts here -->
        <script type="module" src="/src/main.jsx"></script>
    </body>
</html>
```

---

### 💬 Interview Q: What is the component tree? How does data flow?

```
App
 └── Home (owns state: products, cart)
      ├── Navbar (receives: cartCount)
      └── ProductList (receives: products, onAddToCart)
           └── ProductCard × N (receives: id, name, price, onAddToCart)

Data flows DOWN via props  →
Events flow UP via callbacks ←

Parent OWNS state → passes to children → children CALL parent's callback
```

---

## 6. Styling Components — 5 Ways & When to Use Each

### Method 1: External CSS File (Global Styles)

```css
/* 📁 src/styles/Button.css */
.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: opacity 0.2s;
}

.btn-primary   { background: #007bff; color: white; }
.btn-secondary { background: #6c757d; color: white; }
.btn-danger    { background: #dc3545; color: white; }

.btn:disabled { opacity: 0.6; cursor: not-allowed; }
```

```jsx
// 📁 src/components/Button.jsx
import "./Button.css"; // import the CSS file

const Button = ({ label, variant = "primary", disabled }) => (
    <button className={`btn btn-${variant}`} disabled={disabled}>
        {label}
    </button>
);
```

> ⚠️ **Global CSS problem:** `.btn` applies everywhere — if another component also defines `.btn`, they clash. This is the main reason scoped alternatives exist.

---

### Method 2: CSS Modules — Scoped by Default ✅ (Most Used in Production)

```css
/* 📁 src/components/Button.module.css */
/* Class names are LOCALLY scoped — no global leaking */
.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
}
.primary   { background: #007bff; color: white; }
.secondary { background: #6c757d; color: white; }
```

```jsx
// 📁 src/components/Button.jsx
import styles from "./Button.module.css"; // import as object

const Button = ({ label, variant = "primary" }) => (
    // styles.btn → "Button_btn__xKjP2" (auto-generated unique class name)
    <button className={`${styles.btn} ${styles[variant]}`}>
        {label}
    </button>
);
```

```
// Console: inspect element shows
// <button class="Button_btn__xKjP2 Button_primary__mN8dA">
// Auto-generated hash → globally unique → no clashes ✅
```

### Multiple Classes with CSS Modules

```jsx
import styles from "./Card.module.css";

// Method 1: template literal
<div className={`${styles.card} ${isActive ? styles.active : ""}`}>

// Method 2: array join
<div className={[styles.card, isActive && styles.active].filter(Boolean).join(" ")}>

// Method 3: classnames library (common in production)
import cn from "classnames";
<div className={cn(styles.card, { [styles.active]: isActive, [styles.disabled]: disabled })}>
```

---

### Method 3: Inline Styles — Dynamic Values Only

```jsx
// Use ONLY for values that change based on JS logic
// Not for static styles — that belongs in CSS

function PriceTag({ price, maxPrice }) {
    const ratio = price / maxPrice;

    // Dynamic inline style based on computed value
    const priceStyle = {
        color: ratio > 0.8 ? "#dc3545" : ratio > 0.5 ? "#fd7e14" : "#28a745",
        fontWeight: "bold",
        fontSize: `${Math.max(14, 20 - ratio * 10)}px`
    };

    return <span style={priceStyle}>₹{price}</span>;
}

// ✅ Good use: dynamic color, width, position, transform
// ❌ Bad use: static styles that never change → use CSS file/module
```

---

### Method 4: Tailwind CSS — Utility Classes (Very Common in 2024+)

```jsx
// No separate CSS file — classes ARE the styling
// Each class = one CSS property

const Button = ({ label, variant, disabled }) => {
    const base = "px-4 py-2 rounded font-medium transition-opacity";
    const variants = {
        primary:   "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-500 text-white hover:bg-gray-600",
        danger:    "bg-red-500 text-white hover:bg-red-600"
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={disabled}
        >
            {label}
        </button>
    );
};
```

---

### Method 5: Styled Components — CSS-in-JS

```jsx
// Install: npm install styled-components
import styled from "styled-components";

// Create a styled element — CSS written in template literal
const StyledButton = styled.button`
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: ${props => props.variant === "danger" ? "#dc3545" : "#007bff"};
    color: white;
    cursor: pointer;

    &:hover { opacity: 0.85; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

// Use like a component
const Button = ({ label, variant, disabled }) => (
    <StyledButton variant={variant} disabled={disabled}>
        {label}
    </StyledButton>
);
```

### Styling Methods Comparison

| Method | Scope | Dynamic? | Production Use |
|--------|-------|----------|----------------|
| External CSS | Global ⚠️ | Limited | Small projects |
| CSS Modules | Scoped ✅ | Limited | Standard choice |
| Inline Styles | Scoped ✅ | Full ✅ | Dynamic values only |
| Tailwind | Scoped ✅ | Good | Very popular in 2024 |
| Styled Components | Scoped ✅ | Full ✅ | Large design systems |

---

### Webpack & Vite — What the Bundler Does

> When you write `import styles from "./Button.module.css"` or `import "./global.css"`, that's not native JavaScript — browsers don't understand CSS imports. The **bundler** (Webpack or Vite) processes these.

```
Your Source Files                Bundler Process             Browser Bundle
────────────────                 ───────────────             ──────────────
Button.jsx      ──┐
Button.module.css─┤  Webpack/Vite  ──→  dist/
ProductCard.jsx ──┤  transforms,         ├── index.html
utils/helpers.js──┤  bundles,            ├── main.js      ← all JS merged
images/logo.png ──┘  optimizes           └── main.css     ← all CSS merged
```

#### What the Bundler Does:
1. **Transpiles** JSX → `React.createElement()` (via Babel)
2. **Scopes** CSS Modules → generates unique class names
3. **Bundles** all imports into optimized output files
4. **Tree-shakes** — removes unused exported code
5. **Minifies** — removes whitespace, shortens variable names
6. **Code splits** — separates vendor code from app code

#### Vite vs Webpack

| | Webpack | Vite |
|--|---------|------|
| Config | Complex | Minimal |
| Dev speed | Slow (rebundles all) | Fast (ES Modules + HMR) |
| HMR | ✅ | ✅ (faster) |
| Create React App | Used Webpack | Deprecated |
| Today's standard | ✅ Still used | ✅ Preferred for new projects |

```js
// vite.config.js — minimal config to get React working
import { defineConfig } from "vite";
import react            from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],  // handles JSX transformation + fast refresh
});
```

---

## 🔁 Concept Recap — Quick Cheatsheet

```
JSX
  Compiles to React.createElement() — not real HTML
  {} = escape hatch back to JavaScript
  Attributes: className, htmlFor, camelCase events
  style={{ camelCaseProps: "values" }} — object, not string

JSX RULES
  1. Single root element — use <> fragment if needed
  2. ALL tags must close — <br /> <img /> etc.
  3. camelCase attributes — className, onClick, tabIndex
  4. Uppercase = React Component, lowercase = HTML tag
  5. {} for JS expressions — not if/else, not for loops

IMPORTS / EXPORTS
  Named:   export const x = ...    → import { x } from "..."
  Default: export default Component → import Component from "..."
  Barrel:  index.js re-exports     → import { A, B } from "./components"
  Alias:   import { x as y }       → rename on import

COMPONENT STRUCTURE
  Base/Leaf    → takes props, renders HTML
  Container    → composes multiple base components
  Page         → owns state, fetches data, orchestrates
  App.jsx      → root, routing
  main.jsx     → mounts App into <div id="root">

DATA FLOW
  Props down  → parent passes data to child
  Events up   → child calls parent's callback function

STYLING OPTIONS
  External CSS    → global scope ⚠️
  CSS Modules     → scoped, .module.css, styles.className ✅
  Inline styles   → JS object, only for dynamic values
  Tailwind        → utility classes, very common today
  Styled-comps    → CSS-in-JS, full dynamic styling

BUNDLER (Vite/Webpack)
  Transpiles JSX → JS
  Scopes CSS Modules
  Bundles + tree-shakes
  Minifies for production
  HMR = Hot Module Replacement (instant browser update on save)
```

---

## 🎯 Interview Questions from This File

1. **What is JSX? Does the browser understand JSX?**
2. **What does JSX compile to? Write the compiled form of `<div className="box"><p>Hello</p></div>`.**
3. **What are the 5 main rules of JSX?**
4. **Why do you use `className` instead of `class` in JSX?**
5. **What is a React Fragment and why do you need it?**
6. **What is the difference between default and named exports?**
7. **Can a file have multiple default exports?**
8. **What is a barrel file? Why is it used?**
9. **Why can't you use `if/else` directly in JSX? What are the alternatives?**
10. **What is the `{{ }}` double-brace in JSX?** (`style={{ color: "red" }}`)
11. **What is the difference between CSS Modules and global CSS?**
12. **What is tree shaking? Which export style enables it better?**
13. **What does Webpack/Vite do? What would break without it?**
14. **What is HMR (Hot Module Replacement)?**
15. **Explain unidirectional data flow in React.** (props down, events up)

---

> 💡 **Backend Engineer Tip:** Think of React components like **FastAPI dependency injection** — components declare what they need (props = function parameters), and the parent provides it. Just as FastAPI routes return JSON that the client consumes, React components return JSX that React renders. The mental model is the same: define inputs, return output, compose into larger systems. The key difference is React is **reactive** — when inputs change, the output automatically re-renders.
