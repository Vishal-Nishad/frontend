# 📘 React Part 2 — Props, Arrays, Conditionals & Dynamic Styling
> **Interview-Ready** | Simple & Accurate | Backend Engineer Perspective

---

## 1. React Props — Passing Data to Components

> **Props** (properties) are how a **parent component passes data to a child component**.
> Think of them like **function arguments** — child declares what it needs, parent provides it.

### Basic Props

```jsx
// Child component — receives props as a parameter object
function UserCard(props) {
    return (
        <div>
            <h2>{props.name}</h2>
            <p>{props.email}</p>
            <p>Age: {props.age}</p>
        </div>
    );
}

// Parent component — passes props like HTML attributes
function App() {
    return (
        <UserCard
            name="Vishal Sharma"
            email="vishal@gmail.com"
            age={23}
        />
    );
}
```

### Destructured Props — Cleaner Way (Used in Production)

```jsx
// Destructure directly in the parameter — much cleaner
function UserCard({ name, email, age }) {
    return (
        <div>
            <h2>{name}</h2>
            <p>{email}</p>
            <p>Age: {age}</p>
        </div>
    );
}

// Usage stays same
<UserCard name="Vishal" email="v@gmail.com" age={23} />
```

### Default Props — Fallback Values

```jsx
// If parent doesn't pass a prop, use the default value
function Button({ label = "Click Me", color = "blue", size = "medium" }) {
    return (
        <button style={{ backgroundColor: color }}>
            {label}
        </button>
    );
}

// Parent uses it:
<Button />                        // uses all defaults → "Click Me", blue, medium
<Button label="Submit" />         // label overridden, rest = default
<Button label="Delete" color="red" />  // two overridden
```

### Passing Different Data Types as Props

```jsx
function ProductCard({ name, price, inStock, rating, tags, onBuy }) {
    return (
        <div>
            <h3>{name}</h3>
            <p>₹{price}</p>                           {/* number */}
            <p>{inStock ? "In Stock" : "Sold Out"}</p> {/* boolean */}
            <p>Rating: {rating}/5</p>                  {/* number */}
        </div>
    );
}

// Parent passing all types:
<ProductCard
    name="Laptop"              // string
    price={79999}              // number  — no quotes, use {}
    inStock={true}             // boolean — no quotes, use {}
    rating={4.5}               // number
    tags={["electronics", "sale"]}  // array
    onBuy={() => console.log("bought")} // function
/>
```

### 💬 Interview Q: What are props? Are they mutable?

> **Answer:** Props are **read-only** data passed from parent to child — a child component **cannot modify** its own props. If a child needs to trigger a change, it calls a **callback function** passed down as a prop. This enforces **unidirectional data flow** — data goes down, events go up.

```jsx
// ❌ WRONG — never mutate props
function Child({ count }) {
    count = count + 1; // ❌ don't do this
}

// ✅ CORRECT — call parent's function to request change
function Child({ count, onIncrement }) {
    return <button onClick={onIncrement}>{count}</button>;
}

function Parent() {
    const [count, setCount] = useState(0);
    return <Child count={count} onIncrement={() => setCount(count + 1)} />;
}
```

---

## 2. Passing Arrays as Props

```jsx
// Parent has an array — passes it as a prop
function App() {
    const skills = ["Python", "FastAPI", "React", "PostgreSQL"];

    const products = [
        { id: 1, name: "Laptop",   price: 79999 },
        { id: 2, name: "Mouse",    price: 499 },
        { id: 3, name: "Keyboard", price: 1999 }
    ];

    return (
        <div>
            {/* Pass array as prop */}
            <SkillList skills={skills} />
            <ProductList products={products} />
        </div>
    );
}

// Child receives the array via props
function SkillList({ skills }) {
    console.log(skills); // ["Python", "FastAPI", "React", "PostgreSQL"]
    return <p>Skills count: {skills.length}</p>;
}
```

---

## 3. Rendering Arrays — Using `.map()`

> React renders arrays by `.map()`-ing over them and returning JSX.
> Every rendered item **must have a unique `key` prop** — React uses it to track items.

### Rendering Array of Strings

```jsx
function SkillList({ skills }) {
    return (
        <ul>
            {skills.map((skill, index) => (
                <li key={index}>{skill}</li>
                // key={index} is okay for static lists
                // use unique id for dynamic lists (add/remove/reorder)
            ))}
        </ul>
    );
}

// Usage: <SkillList skills={["Python", "FastAPI", "React"]} />
// Output:
// • Python
// • FastAPI
// • React
```

### Rendering Array of Objects (Most Common)

```jsx
function ProductList({ products }) {
    return (
        <div className="product-grid">
            {products.map(product => (
                <div key={product.id} className="card">   {/* key = unique id */}
                    <h3>{product.name}</h3>
                    <p>₹{product.price}</p>
                </div>
            ))}
        </div>
    );
}

// Usage:
// <ProductList products={[{id:1, name:"Laptop", price:79999}, ...]} />
```

### Rendering with Filter + Map (Very Common Interview Pattern)

```jsx
function ActiveUserList({ users }) {
    return (
        <ul>
            {users
                .filter(user => user.isActive)     // keep only active
                .map(user => (
                    <li key={user.id}>{user.name}</li>
                ))
            }
        </ul>
    );
}

// Console log to understand:
const users = [
    { id: 1, name: "Vishal", isActive: true },
    { id: 2, name: "Hela",   isActive: false },
    { id: 3, name: "Reva",   isActive: true }
];

users.filter(u => u.isActive).map(u => u.name);
// Console: ["Vishal", "Reva"]
```

### ⚠️ The `key` Prop — Why It Matters

```jsx
// ❌ No key — React warns + may render incorrectly
{items.map(item => <li>{item.name}</li>)}
// Warning: Each child in a list should have a unique "key" prop.

// ❌ Index as key — bad for dynamic lists (items can be added/removed/reordered)
{items.map((item, index) => <li key={index}>{item.name}</li>)}

// ✅ Unique ID as key — always use this for dynamic lists
{items.map(item => <li key={item.id}>{item.name}</li>)}
```

### 💬 Interview Q: Why does React need a `key` prop in lists?

> **Answer:** React uses the `key` to identify which items in the list have changed, been added, or removed. Without keys, React re-renders the entire list on every change. With stable unique keys, React only updates the specific items that changed — this is a **performance optimization**.

---

## 4. Conditionals Based on Props

### Pattern 1: Ternary — Show One or the Other

```jsx
function StatusBadge({ isActive }) {
    return (
        <span>
            {isActive ? "✅ Active" : "❌ Inactive"}
        </span>
    );
}

// <StatusBadge isActive={true} />   → ✅ Active
// <StatusBadge isActive={false} />  → ❌ Inactive
```

### Pattern 2: `&&` — Show Only If True

```jsx
function UserCard({ name, isAdmin, isPremium }) {
    return (
        <div>
            <h2>{name}</h2>
            {isAdmin   && <span className="badge admin">Admin</span>}
            {isPremium && <span className="badge premium">⭐ Premium</span>}
        </div>
    );
}

// <UserCard name="Vishal" isAdmin={true} isPremium={false} />
// Renders: "Vishal" + Admin badge (no Premium badge)
```

### Pattern 3: Early Return — Render Nothing or Different UI

```jsx
function ProductCard({ product }) {
    // Early return — render nothing if no product
    if (!product) return null;

    // Early return — different UI for out-of-stock
    if (!product.inStock) {
        return (
            <div className="card disabled">
                <h3>{product.name}</h3>
                <p>Out of Stock</p>
            </div>
        );
    }

    // Normal render
    return (
        <div className="card">
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <button>Add to Cart</button>
        </div>
    );
}
```

### Pattern 4: Change Content Based on Prop Value

```jsx
function Alert({ type, message }) {
    // Compute text/icon based on prop
    const config = {
        success: { icon: "✅", text: "Success" },
        error:   { icon: "❌", text: "Error" },
        warning: { icon: "⚠️", text: "Warning" },
        info:    { icon: "ℹ️", text: "Info" }
    };

    const { icon, text } = config[type] || config.info;

    return (
        <div className={`alert alert-${type}`}>
            <span>{icon}</span>
            <strong>{text}:</strong> {message}
        </div>
    );
}

// <Alert type="success" message="Profile updated!" />
// Renders: ✅ Success: Profile updated!

// <Alert type="error" message="Something went wrong" />
// Renders: ❌ Error: Something went wrong
```

---

## 5. Dynamic Component Styling

### Method 1: Dynamic `className` Based on Prop

```jsx
// CSS classes change based on prop value
function Button({ label, variant = "primary", disabled }) {
    return (
        <button
            className={`btn btn-${variant} ${disabled ? "btn-disabled" : ""}`}
            disabled={disabled}
        >
            {label}
        </button>
    );
}

// <Button label="Submit" variant="primary" />
// className = "btn btn-primary"

// <Button label="Delete" variant="danger" />
// className = "btn btn-danger"

// <Button label="Save" variant="primary" disabled={true} />
// className = "btn btn-primary btn-disabled"
```

```css
/* Your CSS file */
.btn          { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; }
.btn-primary  { background: #007bff; color: white; }
.btn-danger   { background: #dc3545; color: white; }
.btn-success  { background: #28a745; color: white; }
.btn-disabled { opacity: 0.5; cursor: not-allowed; }
```

### Method 2: Dynamic Inline Style Based on Prop

```jsx
// Use inline style when the value is truly dynamic (computed, not just a class toggle)
function ProgressBar({ percentage, color = "#007bff" }) {
    return (
        <div style={{ backgroundColor: "#eee", borderRadius: "6px", height: "10px" }}>
            <div
                style={{
                    width: `${percentage}%`,       // dynamic — can't predefine in CSS
                    backgroundColor: color,         // dynamic — user-provided color
                    height: "100%",
                    borderRadius: "6px",
                    transition: "width 0.3s ease"
                }}
            />
        </div>
    );
}

// <ProgressBar percentage={75} color="#28a745" />
// Renders a green bar at 75% width

// <ProgressBar percentage={30} color="#dc3545" />
// Renders a red bar at 30% width
```

### Method 3: Change Background Color Based on Prop (Your Specific Example)

```jsx
function StatusCard({ status }) {
    // Map status → background color
    const bgColors = {
        active:  "#d4edda",  // light green
        pending: "#fff3cd",  // light yellow
        error:   "#f8d7da",  // light red
        idle:    "#e2e3e5"   // light gray
    };

    const textColors = {
        active:  "#155724",
        pending: "#856404",
        error:   "#721c24",
        idle:    "#383d41"
    };

    const bgColor   = bgColors[status]   || bgColors.idle;
    const textColor = textColors[status] || textColors.idle;

    return (
        <div
            style={{
                backgroundColor: bgColor,
                color: textColor,
                padding: "16px",
                borderRadius: "8px",
                border: `1px solid ${bgColor}`
            }}
        >
            <h3>Status: {status.toUpperCase()}</h3>
            <p>This card changes color based on status prop</p>
        </div>
    );
}

// App.jsx
function App() {
    return (
        <div>
            <StatusCard status="active"  />   {/* green background */}
            <StatusCard status="pending" />   {/* yellow background */}
            <StatusCard status="error"   />   {/* red background */}
        </div>
    );
}
```

### Method 4: Combining className + Inline Style (Production Pattern)

```jsx
function Tag({ label, color }) {
    // Static layout → CSS class
    // Dynamic color → inline style
    return (
        <span
            className="tag"                    // static styles in CSS
            style={{ backgroundColor: color }} // dynamic value in inline
        >
            {label}
        </span>
    );
}
```

```css
/* tag.css */
.tag {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    color: white;
    /* No background here — it comes from inline style */
}
```

```jsx
// Usage
<Tag label="Python"   color="#3776AB" />
<Tag label="FastAPI"  color="#009688" />
<Tag label="React"    color="#61DAFB" />
```

---

## 🏭 Production Example — Putting It All Together

```jsx
// A real-world-style component using all concepts from Part 2

const users = [
    { id: 1, name: "Vishal", role: "admin",  isActive: true,  score: 95 },
    { id: 2, name: "Hela",   role: "viewer", isActive: false, score: 72 },
    { id: 3, name: "Reva",   role: "editor", isActive: true,  score: 88 }
];

// Base component — receives one user as prop
function UserRow({ name, role, isActive, score }) {
    // Dynamic color based on score
    const scoreColor = score >= 90 ? "#28a745" : score >= 75 ? "#fd7e14" : "#dc3545";

    return (
        <div className={`user-row ${isActive ? "active" : "inactive"}`}>
            <span>{name}</span>

            {/* Conditional badge */}
            {role === "admin" && <span className="badge">Admin</span>}

            {/* Dynamic inline color for score */}
            <span style={{ color: scoreColor, fontWeight: "bold" }}>
                {score}
            </span>

            {/* Conditional text */}
            <span>{isActive ? "✅ Online" : "⭕ Offline"}</span>
        </div>
    );
}

// Parent — renders list
function UserTable() {
    return (
        <div>
            <h2>Users ({users.length})</h2>

            {/* Filter + map */}
            {users
                .filter(u => u.isActive)
                .map(user => (
                    <UserRow
                        key={user.id}
                        name={user.name}
                        role={user.role}
                        isActive={user.isActive}
                        score={user.score}
                    />
                ))
            }
        </div>
    );
}

// Console output — what filter + map produces:
console.log(users.filter(u => u.isActive).map(u => u.name));
// ["Vishal", "Reva"]
```

---

## 🔁 Quick Cheatsheet

```
PROPS
  Pass data: <Card name="vishal" age={23} isActive={true} />
  Receive:   function Card({ name, age, isActive }) { ... }
  Default:   function Card({ name = "Guest" }) { ... }
  Rule:      Props are READ-ONLY — never mutate them
  Events up: pass callback as prop → child calls it

ARRAYS AS PROPS
  <List items={["a", "b", "c"]} />
  <List items={[{id:1, name:"x"}, ...]} />

RENDERING ARRAYS
  {items.map(item => <li key={item.id}>{item.name}</li>)}
  key = unique id — required for lists, use item.id not index for dynamic lists
  filter + map = very common pattern

CONDITIONALS
  Ternary:     {isActive ? "Online" : "Offline"}
  &&:          {isAdmin && <AdminBadge />}
  Early return: if (!data) return null;
  Object map:  const colors = { success:"green", error:"red" }[type]

DYNAMIC STYLING
  className:   className={`btn btn-${variant}`}
  Inline:      style={{ color: score > 90 ? "green" : "red" }}
  Rule:        static styles → CSS class | dynamic values → inline style
```

---

## 🎯 Interview Questions from This Part

1. **What are props? Can a child modify its own props?**
2. **How does data flow in React?** (one-directional — props down, events up)
3. **Why is the `key` prop required in lists? What happens without it?**
4. **Why should you avoid using array index as `key` in dynamic lists?**
5. **What is the difference between `&&` and ternary for conditional rendering?**
6. **What is the `0 &&` bug in React?** (renders `0` when count=0)
7. **When would you use inline style vs CSS class?**
8. **How do you pass a function as a prop? Why would you do that?**

---

> 💡 **Backend Analogy:** Props are like **HTTP request parameters** in FastAPI.
> Just as `def get_user(user_id: int, active: bool = True)` declares what the endpoint needs,
> `function UserCard({ id, isActive = true })` declares what the component needs.
> The caller (parent component / HTTP client) provides the values. The function just uses them — never modifies the input.
