# 📘 JavaScript — DOM Events & Event Handling
> **Interview-Ready Reference** |  Company Prep

---

## 🧠 What This File Covers

| # | Concept | Interview Weight |
|---|---------|-----------------|
| 1 | `onclick` vs `addEventListener` | ⭐⭐⭐⭐⭐ |
| 2 | Event Object `event` | ⭐⭐⭐⭐⭐ |
| 3 | `this` Inside Event Listeners | ⭐⭐⭐⭐⭐ |
| 4 | Keyboard Events | ⭐⭐⭐⭐ |
| 5 | Form Events & `event.preventDefault()` | ⭐⭐⭐⭐⭐ |
| 6 | `change` vs `input` Events | ⭐⭐⭐⭐ |
| 7 | Random Color Generator (Practice) | ⭐⭐⭐ |

---

## 1. `onclick` vs `addEventListener` — The Most Important Distinction

### `onclick` — Old Way, Only One Handler at a Time

```js
const btns = document.querySelectorAll("button");

for (let i = 0; i < btns.length - 1; i++) {
    btns[i].onclick = sayHello;       // ✅ assigns handler
    btns[i].onclick = sayName;        // ❌ OVERWRITES the previous one!

    btns[i].onmouseenter = function () {
        console.log("you are hovering over button");
    };
}

function sayHello() { alert("hello!"); }
function sayName()  { alert("how are you vishal"); }
```

> ⚠️ `onclick` is a **property** — setting it twice replaces the first.
> Only one handler can exist at a time per event type.

---

### `addEventListener` — Modern Way, Multiple Handlers

```js
const btn2 = document.querySelector("#addEventListener");

// Both fire on the SAME click — nothing overwritten
btn2.addEventListener("click", sayHello);
btn2.addEventListener("click", sayName);

// Double click
const btn3 = document.querySelector("#addEventListenerDbc");
btn3.addEventListener("dblclick", function () {
    console.log("you double clicked me");
});
```

### Console Output (on btn2 click)
```
alert: "hello!"
alert: "how are you vishal"
```

### 💬 Interview Q: What is the difference between `onclick` and `addEventListener`?

| | `onclick` | `addEventListener` |
|--|-----------|-------------------|
| Multiple handlers? | ❌ No — overwrites | ✅ Yes — stacks |
| Remove handler? | `el.onclick = null` | `removeEventListener()` |
| Event phases? | Bubbling only | Bubbling + Capturing |
| Inline HTML? | ✅ Can use | ❌ Cannot |
| Preferred? | ❌ Avoid in production | ✅ Always use this |

### 💬 Interview Q: How do you remove an event listener?

```js
function handleClick() {
    console.log("clicked");
}

btn.addEventListener("click", handleClick);

// To remove — must pass the EXACT same function reference
btn.removeEventListener("click", handleClick); // ✅ works

// ❌ This does NOT work — anonymous functions have different references
btn.addEventListener("click", () => console.log("clicked"));
btn.removeEventListener("click", () => console.log("clicked")); // ❌ fails
```

> This is a classic interview trap — **you cannot remove an anonymous function listener.**
> Always store the function in a variable if you need to remove it later.

### 🏭 Production Example — One-Time Click Handler

```js
// Pay button should only fire ONCE — prevent double charges
function handlePayment() {
    processPayment();
    btn.removeEventListener("click", handlePayment); // remove after first use
    btn.disabled = true;
    btn.innerText = "Payment Processing...";
}

const btn = document.querySelector("#payBtn");
btn.addEventListener("click", handlePayment);
```

---

## 2. The Event Object — Hidden Argument in Every Callback

> Every event listener callback automatically receives an **event object** as its first argument.
> It contains everything about what happened — which key, which mouse button, where on screen, which element, etc.

```js
const btn5 = document.querySelector("#keyboardEvents");

btn5.addEventListener("click", function (event) {
    console.log(event);          // PointerEvent { type: "click", target: button, ... }
    console.log(event.type);     // "click"
    console.log(event.target);   // <button id="keyboardEvents">...</button>
    console.log(event.timeStamp);// time in ms since page loaded
});
```

### Console Output
```
PointerEvent {
  type: "click",
  target: <button#keyboardEvents>,
  clientX: 245,
  clientY: 312,
  timeStamp: 4821.3,
  ...
}
click
<button id="keyboardEvents">...</button>
4821.3
```

### Most Used Event Object Properties

```js
element.addEventListener("click", function (e) {
    e.target;          // element that was ACTUALLY clicked (could be child)
    e.currentTarget;   // element the listener is ATTACHED to
    e.type;            // "click", "keydown", "submit", etc.
    e.preventDefault();// stop default browser behavior
    e.stopPropagation();// stop event bubbling up the DOM tree
});
```

### 💬 Interview Q: What is the difference between `e.target` and `e.currentTarget`?

```js
// HTML: <div id="outer"> <button id="inner">Click</button> </div>
const outer = document.querySelector("#outer");

outer.addEventListener("click", function (e) {
    console.log(e.target);        // <button#inner> — what was clicked
    console.log(e.currentTarget); // <div#outer>    — where listener lives
});
// If you click the BUTTON:
// e.target        = button  (the actual clicked element)
// e.currentTarget = div     (the element with the listener)
```

> This distinction is the foundation of **event delegation** — one of the most important patterns in production JS.

---

## 3. `this` Inside Event Listeners — Refers to the Attached Element

```js
const btn4 = document.querySelector("#thisInAddELTest");

btn4.addEventListener("click", function () {
    console.log(this); // <button id="thisInAddELTest">...</button>
    this.style.backgroundColor = "red"; // changes the clicked button
});

// Real power — reuse one function across multiple elements
function changeColor() {
    console.log(this); // whichever element was clicked
    this.style.backgroundColor = "red";
}

const elements = document.querySelectorAll(".thisTest");
for (let el of elements) {
    el.addEventListener("click", changeColor); // `this` = each el at click time
}
```

### ⚠️ Arrow Functions Break `this` in Event Listeners

```js
const btn = document.querySelector("button");

// ❌ Arrow function — `this` is NOT the button
btn.addEventListener("click", () => {
    console.log(this); // Window object — wrong!
    this.style.backgroundColor = "red"; // TypeError in strict mode
});

// ✅ Regular function — `this` IS the button
btn.addEventListener("click", function () {
    console.log(this); // <button> — correct
    this.style.backgroundColor = "red"; // works
});
```

> **Rule:** Always use regular functions (not arrow functions) in event listeners when you need `this` to refer to the clicked element.

---

## 4. Keyboard Events — `keydown`, `keyup`, `keypress`

```js
const inp = document.querySelector("input");

inp.addEventListener("keydown", function (event) {
    console.log("key =", event.key, "| code =", event.code);

    // event.key  → the actual character ("a", "A", "Enter", " ")
    // event.code → the physical key ("KeyA", "Space", "ArrowUp")

    if (event.code === "ArrowUp")    console.log("character moves forward");
    else if (event.code === "ArrowDown")  console.log("character moves backward");
    else if (event.code === "ArrowLeft")  console.log("character moves left");
    else if (event.code === "ArrowRight") console.log("character moves right");
});
```

### Console Output (pressing A, then ArrowUp)
```
key = a      | code = KeyA
key = ArrowUp| code = ArrowUp
character moves forward
```

### `event.key` vs `event.code` — Critical Difference

```js
// If user presses "A" key:
event.key  = "a"    // lowercase (depends on Shift/CapsLock)
event.code = "KeyA" // always "KeyA" regardless of case

// If user presses Shift + A:
event.key  = "A"    // uppercase
event.code = "KeyA" // same physical key

// If user presses Space:
event.key  = " "      // a space character
event.code = "Space"  // the word "Space"
```

> **Rule:**
> - Use `event.key` when you care about the **character typed** (form input, shortcuts)
> - Use `event.code` when you care about the **physical key** (games, arrow keys, WASD movement)

### 🏭 Production Example — Keyboard Shortcuts

```js
document.addEventListener("keydown", function (e) {
    // Ctrl + S → Save
    if (e.code === "KeyS" && e.ctrlKey) {
        e.preventDefault(); // stop browser's save dialog
        saveDocument();
        console.log("Document saved");
    }

    // Escape → Close modal
    if (e.code === "Escape") {
        document.querySelector(".modal")?.classList.remove("active");
    }
});
```

### `keydown` vs `keyup` vs `keypress`

| Event | When fires | Use case |
|-------|-----------|----------|
| `keydown` | As soon as key is pressed | Games, shortcuts, block keys |
| `keyup` | When key is released | Validate after typing complete |
| `keypress` | ~~Deprecated~~ | Avoid — use `keydown` instead |

---

## 5. Form Events & `event.preventDefault()` — Most Important Form Concept

```js
const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
    // 🔑 CRITICAL — stop default browser behavior
    // Without this, the page RELOADS on every form submit
    event.preventDefault();

    // Access form fields via form.elements
    // form.elements[0]        → first input (by index)
    // form.elements["user"]   → input with name="user" or id="user"
    // this.elements[0]        → same as form.elements[0] (this = form)

    const user = this.elements[0]; // first input
    const pass = this.elements[1]; // second input

    console.log(user.value); // .value → what user typed (NOT .innerText)
    console.log(pass.value);

    alert(`Hi ${user.value}, your password is set to ${pass.value}`);
});
```

### Console Output (typing "vishal" and "abc123", then submitting)
```
vishal
abc123
```

### ⚠️ `.value` vs `.innerText` for Input Elements

```js
// Given: <input id="user" value="vishal">

const input = document.querySelector("#user");

input.innerText; // ""        ← inputs have no inner text — always empty
input.value;     // "vishal"  ← .value holds what user typed ✅

// Textarea also uses .value
const textarea = document.querySelector("textarea");
textarea.value; // whatever was typed
```

> **Rule:** For `<input>`, `<textarea>`, `<select>` — always use `.value`. For everything else (`<p>`, `<h1>`, `<div>`) — use `.innerText` or `.textContent`.

### 💬 Interview Q: What does `event.preventDefault()` do? Give 3 real examples.

> **Answer:** It prevents the browser's **default behavior** for that event — the built-in action the browser would normally take.

```js
// 1. Stop form reload on submit
form.addEventListener("submit", e => {
    e.preventDefault();
    // Now handle with JS / fetch API
});

// 2. Stop link navigation
anchor.addEventListener("click", e => {
    e.preventDefault();
    // Custom SPA routing instead
});

// 3. Stop right-click context menu
document.addEventListener("contextmenu", e => {
    e.preventDefault();
    showCustomMenu(e.clientX, e.clientY);
});
```

### 🏭 Production Example — Login Form with Validation

```js
const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // stop page reload

    const email    = this.elements["email"].value.trim();
    const password = this.elements["password"].value;

    // Client-side validation before API call
    if (!email || !password) {
        showError("All fields are required");
        return;
    }

    if (!email.includes("@")) {
        showError("Enter a valid email");
        return;
    }

    // Disable button to prevent double submit
    const submitBtn = this.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.innerText = "Logging in...";

    try {
        const res  = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) window.location.href = "/dashboard";
        else showError(data.message);
    } catch (err) {
        showError("Network error. Try again.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Login";
    }
});
```

---

## 6. `change` vs `input` Events — Know the Timing Difference

```js
const inp1  = document.querySelector("#inpChangeEvent");
const para1 = document.querySelector("#paraChangeEvent");

// change — fires AFTER user leaves the field (on blur) OR selects an option
inp1.addEventListener("change", function () {
    console.log(inp1.value);
    para1.innerText = inp1.value;
});

// input — fires on EVERY keystroke, immediately as value changes
inp1.addEventListener("input", function () {
    para1.innerText = inp1.value; // live, character-by-character
});
```

### Console Output Comparison

```
// User types "hello" slowly:

// With "change":  fires once when user clicks away
hello

// With "input": fires on every keystroke
h
he
hel
hell
hello
```

### When to Use Which

| Event | Fires when | Use for |
|-------|-----------|---------|
| `input` | Every keystroke, immediately | Live search, character counter, live preview |
| `change` | After user leaves the field / finishes | Dropdowns, checkboxes, final validation |
| `blur` | When element loses focus | Validate field after user moves on |

### 🏭 Production Example — Live Search with Debounce

```js
const searchInput = document.querySelector("#search");
let debounceTimer;

// input fires every keystroke — debounce prevents API call on every key
searchInput.addEventListener("input", function () {
    const query = this.value.trim();

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (query.length >= 2) {
            fetchSearchResults(query); // API call only after 400ms pause
        }
    }, 400);
});
```

---

## 7. Practice Project — Random Color Generator

```js
const btn = document.querySelector("button");

btn.addEventListener("click", function () {
    const h3  = document.querySelector("h3");
    const div = document.querySelector("div");

    const randomColor = getRandomColor();

    h3.innerText = randomColor;              // show the color string
    div.style.backgroundColor = randomColor; // apply color to box

    console.log("color updated");
    console.log(randomColor);
});

function getRandomColor() {
    const r = Math.floor(Math.random() * 255); // 0-254
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;            // "rgb(142, 37, 201)"
}
```

### Console Output (on button click)
```
color updated
rgb(142, 37, 201)
```

### 🔍 How `getRandomColor()` Works

```
Math.random()        → 0.557...
* 255                → 142.2...
Math.floor(...)      → 142

Same for g and b → e.g. 37, 201

Template literal → "rgb(142, 37, 201)"
```

### 🏭 Production Upgrade — Full Hex Color Generator

Real apps use **hex colors** (`#A3F2C1`) because they're shorter and more standard:

```js
function getRandomHexColor() {
    // Math.random() * 16777215 = random number from 0 to #FFFFFF
    const hex = Math.floor(Math.random() * 16777215).toString(16);
    return `#${hex.padStart(6, "0")}`; // ensure always 6 digits
}

console.log(getRandomHexColor()); // "#a3f2c1"

// Copy color to clipboard on click
btn.addEventListener("click", function () {
    const color = getRandomHexColor();
    document.querySelector("div").style.backgroundColor = color;
    document.querySelector("h3").innerText = color;

    navigator.clipboard.writeText(color).then(() => {
        console.log(`${color} copied to clipboard!`);
    });
});
```

### 💬 Interview Q: What is event bubbling? How does it relate to event delegation?

> **Answer:** When an event fires on an element, it **bubbles up** through every parent — the event fires on the child, then its parent, then grandparent, all the way to `document`.

```js
// HTML: <ul> <li>Item 1</li> <li>Item 2</li> </ul>

// ❌ Inefficient — listener on every <li>
document.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", e => console.log(e.target.innerText));
});

// ✅ Event Delegation — ONE listener on parent, catches all children
// Works even for dynamically added <li> elements!
document.querySelector("ul").addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        console.log(e.target.innerText); // "Item 1" or "Item 2"
    }
});
```

> **Event Delegation** = attach one listener to a parent, let events bubble up from children.
> **Why it matters in production:** When you render 500 product cards or a 1000-row table, you can't attach 500/1000 listeners — that kills performance. One listener on the parent catches all of them.

---

## 🔁 Concept Recap — Quick Cheatsheet

```
onclick = fn         → one handler only, overwrites previous
addEventListener     → multiple handlers, stacking, preferred ✅

removeEventListener  → must pass SAME function reference
                       anonymous functions CANNOT be removed

Event Object (e)     → auto-passed to every callback
  e.target           → element actually clicked (may be child)
  e.currentTarget    → element listener is attached to
  e.preventDefault() → stop browser default (reload, navigate)
  e.stopPropagation()→ stop event bubbling up
  e.key              → character pressed ("a", "Enter", " ")
  e.code             → physical key ("KeyA", "Space", "ArrowUp")

this in listener     → regular fn: refers to element with listener
                       arrow fn: refers to outer scope (Window) ❌

.value               → use for input, textarea, select (NOT .innerText)

input event          → fires every keystroke (live)
change event         → fires after user leaves the field (final)

Event Bubbling       → event travels child → parent → grandparent
Event Delegation     → one parent listener catches all child events
                       works for dynamically added elements too ✅
```

---

## 🎯 Must-Know Interview Questions from This File

1. **What is the difference between `onclick` and `addEventListener`?**
2. **Can you attach multiple event handlers to one element? How?**
3. **Why can't you remove an anonymous function event listener?**
4. **What is the event object? Name 5 properties on it.**
5. **What is `event.preventDefault()`? Give 3 real use cases.**
6. **What is the difference between `e.target` and `e.currentTarget`?**
7. **Why shouldn't you use arrow functions as event listener callbacks when you need `this`?**
8. **What is the difference between `event.key` and `event.code`?**
9. **What is the difference between `input` and `change` events?**
10. **What is event bubbling? What is event delegation? Why is delegation preferred in production?**

---

> 💡 **Tip for  Interviews:** Event delegation is the concept that separates people who learned JS from people who've built real products. Interviewers at Razorpay, Swiggy, Zepto love asking *"you have a dynamic list of 500 items — how do you handle click events efficiently?"* The answer is one parent listener using `e.target` — not 500 individual listeners. Also, `event.preventDefault()` on form submit is the entry point into the **entire fetch/async API** flow — master this and the next file on Promises/Async-Await becomes natural.
