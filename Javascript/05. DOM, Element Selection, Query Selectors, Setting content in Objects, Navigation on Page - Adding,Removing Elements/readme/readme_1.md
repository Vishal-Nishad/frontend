# 📘 JavaScript — DOM Manipulation
> **Interview-Ready Reference** | Product-Based Company Prep

---

## 🧠 What This File Covers

| # | Concept | Interview Weight |
|---|---------|-----------------|
| 1 | What is the DOM? | ⭐⭐⭐⭐⭐ |
| 2 | Selecting Elements (4 ways) | ⭐⭐⭐⭐⭐ |
| 3 | Reading & Setting Content | ⭐⭐⭐⭐⭐ |
| 4 | Manipulating Attributes | ⭐⭐⭐⭐ |
| 5 | Manipulating Styles | ⭐⭐⭐⭐ |
| 6 | classList API | ⭐⭐⭐⭐⭐ |
| 7 | DOM Tree Navigation | ⭐⭐⭐⭐ |
| 8 | Creating & Adding Elements | ⭐⭐⭐⭐⭐ |
| 9 | Removing Elements | ⭐⭐⭐⭐ |

---

## 1. What is the DOM?

> The **DOM (Document Object Model)** is a tree-like representation of your HTML page in memory. JavaScript can read and change this tree — which changes what you see on the screen in real time, without reloading the page.

```
HTML File                     DOM Tree in Memory
─────────────                 ──────────────────────────
<html>                        Document
  <body>                      └── html
    <h1>Hello</h1>                └── body
    <p>World</p>                      ├── h1  → "Hello"
  </body>                            └── p   → "World"
</html>
```

### 💬 Interview Q: What is the difference between the DOM and HTML?

> **Answer:** HTML is just **text** — a string of markup saved in a file. The DOM is a **live, in-memory object representation** of that HTML that the browser builds when it parses the file. JS interacts with the DOM (the objects), not the raw HTML text.

---

## 2. Selecting Elements — 4 Ways to Target the DOM

### a. `getElementById` — returns ONE element or `null`

```js
let img = document.getElementById("mainImg");
console.dir(img); // Logs the full DOM object with all properties
```

> `console.dir()` shows the object as a tree of properties — use it to explore what's available on a DOM element (vs `console.log` which shows the HTML tag).

---

### b. `getElementsByClassName` — returns HTMLCollection (live)

```js
let images = document.getElementsByClassName("oldImg");
console.dir(images); // HTMLCollection(3) [img, img, img]
```

> ⚠️ **HTMLCollection is NOT an array** — it's array-like. You can index it (`[0]`, `[1]`) but you cannot use `.map()`, `.filter()`, `.forEach()` directly on it.

```js
// Convert to real array first
const arr = Array.from(images);
arr.forEach(img => console.log(img.src));
```

---

### c. `getElementsByTagName` — returns HTMLCollection by tag

```js
let paragraphs = document.getElementsByTagName("p");
console.log(paragraphs); // HTMLCollection of all <p> tags
```

---

### d. `querySelector` & `querySelectorAll` — CSS selector power (most used)

```js
// querySelector — returns FIRST match or null
document.querySelector("h1");              // first <h1>
document.querySelector("#description");    // element with id="description"
document.querySelector(".oldImg");         // first element with class="oldImg"
document.querySelector("div a");           // first <a> inside any <div>

// querySelectorAll — returns NodeList of ALL matches
document.querySelectorAll("p");            // all <p> elements → NodeList
```

### HTMLCollection vs NodeList — The Key Difference

| | `getElementsBy*` | `querySelectorAll` |
|--|------------------|--------------------|
| Returns | HTMLCollection | NodeList |
| Live (auto-updates)? | ✅ Yes — live | ❌ No — static snapshot |
| `.forEach()` | ❌ Not directly | ✅ Yes |
| `.map()` / `.filter()` | ❌ No | ❌ No (still not array) |
| Convert to array | `Array.from()` | `Array.from()` or `[...list]` |

### 💬 Interview Q: Why do most developers prefer `querySelector` over `getElementById`?

> **Answer:** `querySelector` uses CSS selector syntax — so you can target anything you can style in CSS. It's more flexible, consistent, and you only need to remember one API. The only reason to use `getElementById` is micro-performance in very hot loops — negligible in practice.

### 🏭 Production Example — Selecting Elements Safely

```js
// Always guard against null — element might not exist yet
const modal = document.querySelector("#modal");
if (modal) {
    modal.style.display = "block";
} else {
    console.warn("Modal element not found in DOM");
}

// Convert NodeList to array to use full array methods
const allCards = [...document.querySelectorAll(".product-card")];
const visibleCards = allCards.filter(card => !card.hidden);
console.log(`${visibleCards.length} products visible`);
```

---

## 3. Reading & Setting Content — 3 Properties

```js
// Given this HTML:
// <p id="demo">Hello <strong>World</strong></p>

const el = document.querySelector("#demo");

el.innerText;    // "Hello World"  — only visible text (respects CSS display:none)
el.textContent;  // "Hello World"  — ALL text including hidden nodes
el.innerHTML;    // "Hello <strong>World</strong>"  — full HTML markup
```

### The Critical Difference

```js
// HTML: <div id="box">  Hello   <span style="display:none">Secret</span>  </div>

const box = document.querySelector("#box");
console.log(box.innerText);   // "Hello"          ← hidden span ignored
console.log(box.textContent); // "  Hello   Secret"← all text, raw with whitespace
console.log(box.innerHTML);   // full HTML string with <span> tag
```

### Setting Content

```js
const title = document.querySelector("h1");
title.innerText  = "New Title";                     // set plain text
title.innerHTML  = "New <strong>Title</strong>";    // set with HTML
```

### ⚠️ XSS Security Warning — Never Use `innerHTML` with User Input

```js
// ❌ DANGEROUS — user can inject malicious script
const userInput = '<img src=x onerror="alert(\'hacked\')">';
el.innerHTML = userInput; // executes the onerror script!

// ✅ SAFE — use innerText or textContent for user-supplied data
el.innerText = userInput; // renders as plain text, not HTML
```

### 💬 Interview Q: What is XSS? How does `innerHTML` enable it?

> **Answer:** XSS (Cross-Site Scripting) is an attack where malicious JS is injected into a webpage. Using `innerHTML` with unsanitized user input directly executes that JS in the victim's browser. Always use `innerText`/`textContent` for user data, or a sanitizer library like DOMPurify.

---

## 4. Manipulating Attributes

```js
const img = document.querySelector("#mainImg");

// Get attribute
img.getAttribute("src");   // "photo.jpg"
img.getAttribute("alt");   // "Profile Photo"

// Set attribute
img.setAttribute("src", "newPhoto.jpg");
img.setAttribute("alt", "Updated Photo");
img.setAttribute("data-id", "u_001");  // custom data attribute

// Remove attribute
img.removeAttribute("alt");

// Check if attribute exists
img.hasAttribute("src"); // true
```

### 🏭 Production Example — Dynamic Image Lazy Loading

```js
// Set placeholder, then load real image
const images = document.querySelectorAll("img[data-src]");

images.forEach(img => {
    const realSrc = img.getAttribute("data-src");
    img.setAttribute("src", realSrc);
    img.removeAttribute("data-src"); // cleanup
});
```

---

## 5. Manipulating Styles with `.style`

```js
const heading = document.querySelector("h1");

// ✅ camelCase for CSS properties with hyphens
heading.style.color           = "purple";
heading.style.backgroundColor = "yellow";  // background-color → camelCase
heading.style.fontSize        = "2rem";
heading.style.borderRadius    = "8px";

// ❌ This is wrong — hyphens not allowed in JS property names
// heading.style.background-color = "yellow";

// Loop and apply styles
const links = document.querySelectorAll(".box a");
links.forEach(link => {
    link.style.color          = "white";
    link.style.textDecoration = "none";
});
```

### 💬 Interview Q: When should you use `.style` vs CSS classes?

> **Answer:** Use `.style` only for **dynamic, computed values** (e.g., positioning based on scroll position, animation progress). For everything else — toggling states, themes, hover effects — use CSS classes via `classList`. Inline styles have highest specificity and make CSS harder to maintain.

---

## 6. `classList` API — The Right Way to Manage Styles

> `classList` lets you add/remove CSS class names on an element — keeping your styles in CSS where they belong.

```js
const heading = document.querySelector("h1");

heading.classList.add("highlight");       // adds class
heading.classList.remove("highlight");    // removes class
heading.classList.contains("highlight");  // true / false — check
heading.classList.toggle("highlight");    // adds if absent, removes if present
heading.classList.replace("old", "new"); // replace one class with another
```

### 🏭 Production Example — Dark Mode Toggle

```js
// CSS:
// .dark-mode { background: #111; color: #fff; }

const toggleBtn = document.querySelector("#themeToggle");
const body      = document.querySelector("body");

toggleBtn.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-mode");
    toggleBtn.innerText = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Restore on page load
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
}
```

### 🏭 Production Example — Active Tab Indicator

```js
const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        // Remove active from all tabs
        tabs.forEach(t => t.classList.remove("active"));
        // Add active only to clicked tab
        tab.classList.add("active");
    });
});
```

---

## 7. DOM Tree Navigation — Moving Through the Tree

```js
const ul   = document.querySelector("ul");
const box  = document.querySelector(".box");

// Going UP — parent
ul.parentElement;               // the direct parent element

// Going DOWN — children
box.children;                   // HTMLCollection of direct children
box.childElementCount;          // number of children (integer)
ul.children[0];                 // first child
ul.children[2];                 // third child (0-indexed)

// Going SIDEWAYS — siblings
ul.children[2].previousElementSibling; // element before index 2
ul.children[1].nextElementSibling;     // element after index 1

// Chaining navigation + style change
ul.children[2].previousElementSibling.style.color = "green";
```

### `children` vs `childNodes` — Know Both

```js
// children — only ELEMENT nodes (ignores text nodes, comments)
ul.children;       // HTMLCollection [li, li, li]

// childNodes — ALL nodes including text, comments
ul.childNodes;     // NodeList [text, li, text, li, text, li, text]
// The "text" nodes are whitespace/newlines between tags
```

### 💬 Interview Q: What is the difference between `parentElement` and `parentNode`?

> **Answer:** `parentNode` can return any node type (including the `document` node itself). `parentElement` returns only element nodes and is `null` if the parent is not an element. In practice, use `parentElement` — it's safer and more predictable.

---

## 8. Creating & Adding Elements — 4 Methods

### Step 1: Always Create First

```js
const newP  = document.createElement("p");
newP.innerText = "Hi, I am a new paragraph";
newP.classList.add("intro");
```

### Step 2: Add to the DOM — 4 Ways

```js
const body = document.querySelector("body");
const box  = document.querySelector(".box");

// a. appendChild — adds as LAST child (single element only)
body.appendChild(newP);

// b. append — adds as LAST child (can append multiple + text)
box.append(newP);
box.append("some raw text", anotherEl); // can take multiple args

// c. prepend — adds as FIRST child
box.prepend(newP);

// d. insertAdjacentElement(position, element) — most precise
const p = document.querySelector("p");

p.insertAdjacentElement("beforebegin", btn); // before <p> itself
p.insertAdjacentElement("afterbegin",  btn); // inside <p>, before first child
p.insertAdjacentElement("beforeend",   btn); // inside <p>, after last child
p.insertAdjacentElement("afterend",    btn); // after <p> itself
```

### Visual of `insertAdjacentElement` positions

```
<!-- beforebegin -->
<p>
    <!-- afterbegin -->
    existing content
    <!-- beforeend -->
</p>
<!-- afterend -->
```

### `appendChild` vs `append` — Quick Comparison

| | `appendChild` | `append` |
|--|--------------|---------|
| Accepts | Single Node only | Multiple Nodes + strings |
| Returns | Appended node | `undefined` |
| Append text directly | ❌ No | ✅ Yes |

### 🏭 Production Example — Rendering a Product List from Data

```js
const products = [
    { id: 1, name: "Laptop",   price: 79999 },
    { id: 2, name: "Mouse",    price: 499 },
    { id: 3, name: "Keyboard", price: 1999 }
];

const container = document.querySelector("#product-list");

// Build and inject each card
products.forEach(product => {
    const card  = document.createElement("div");
    const title = document.createElement("h3");
    const price = document.createElement("p");
    const btn   = document.createElement("button");

    card.classList.add("product-card");
    title.innerText = product.name;
    price.innerText = `₹${product.price}`;
    btn.innerText   = "Add to Cart";
    btn.dataset.id  = product.id;

    card.append(title, price, btn);
    container.appendChild(card);
});
```

### 🏭 Production Example — Your Assignment Code (Explained)

```js
// Q1. Red paragraph
const para1 = document.createElement("p");
para1.innerText = "Hey I'm red";
para1.classList.add("red");          // style controlled by CSS .red { color: red }
document.querySelector("body").append(para1);

// Q2. Blue h3
const head3 = document.createElement("h3");
head3.innerText = "I'm a blue h3";
head3.classList.add("blue");
document.querySelector("body").append(head3);

// Q3. Div with black border + pink bg containing h1 and p
const div  = document.createElement("div");
const h1   = document.createElement("h1");
const para = document.createElement("p");

h1.innerText   = "I'm in a div";
para.innerText = "ME TOO!";
div.classList.add("box");  // CSS .box { border: 1px solid black; background: pink }

div.append(h1, para);              // append both children at once
document.querySelector("body").prepend(div); // add div at TOP of body
```

### 💬 Interview Q: Why is `DocumentFragment` used in production instead of appending in a loop?

> **Answer:** Every `appendChild` call triggers a **DOM reflow/repaint** — expensive. A `DocumentFragment` is an in-memory node that sits outside the live DOM. You append everything to it first, then insert it once — causing only one reflow.

```js
const fragment = document.createDocumentFragment();

products.forEach(p => {
    const card = document.createElement("div");
    card.innerText = p.name;
    fragment.appendChild(card); // no reflow yet
});

container.appendChild(fragment); // ONE reflow — much faster ✅
```

---

## 9. Removing Elements

```js
const body = document.querySelector("body");
const btn  = document.querySelector("button");
const p    = document.querySelector("p");

// Remove a child from its parent
body.removeChild(btn); // removes btn from body

// Remove element directly (modern, simpler)
p.remove();            // removes p from wherever it is

// ⚠️ body.remove() removes the entire body — use with extreme caution
```

### 🏭 Production Example — Remove Notification Card

```js
document.querySelectorAll(".notification").forEach(notif => {
    const closeBtn = notif.querySelector(".close-btn");

    closeBtn.addEventListener("click", () => {
        // Animate out, then remove
        notif.classList.add("fade-out");
        setTimeout(() => notif.remove(), 300); // remove after CSS animation ends
    });
});
```

---

## 🔁 Concept Recap — Quick Cheatsheet

```
SELECTING
  getElementById("id")           → one element or null
  getElementsByClassName("cls")  → HTMLCollection (live, not array)
  getElementsByTagName("tag")    → HTMLCollection (live, not array)
  querySelector("css")           → first match or null  ← USE THIS
  querySelectorAll("css")        → NodeList (static, has .forEach)

CONTENT
  .innerText    → visible text only (respects CSS)
  .textContent  → all text including hidden
  .innerHTML    → full HTML string — ⚠️ XSS risk with user input

ATTRIBUTES
  .getAttribute(attr)         → read
  .setAttribute(attr, val)    → write
  .removeAttribute(attr)      → delete

STYLE
  .style.camelCaseProp = val  → inline style (use sparingly)
  .classList.add/remove/toggle/contains  → preferred approach

NAVIGATION
  .parentElement              → go up
  .children                   → go down (HTMLCollection)
  .childElementCount          → count of children
  .previousElementSibling     → go left
  .nextElementSibling         → go right

CREATING & ADDING
  document.createElement("tag")       → create new element
  parent.appendChild(el)              → add as last child
  parent.append(el, el2, "text")      → add multiple as last
  parent.prepend(el)                  → add as first child
  el.insertAdjacentElement(pos, el2)  → precise positioning

REMOVING
  parent.removeChild(child)   → remove specific child
  el.remove()                 → remove self (modern, preferred)
```

---

## 🎯 Must-Know Interview Questions from This File

1. **What is the DOM? How is it different from HTML?**
2. **What is the difference between `querySelector` and `getElementById`?**
3. **What is the difference between `HTMLCollection` and `NodeList`?**
4. **What is the difference between `innerText`, `textContent`, and `innerHTML`?**
5. **Why is `innerHTML` dangerous with user input? What is XSS?**
6. **What is the difference between `children` and `childNodes`?**
7. **What is the difference between `appendChild` and `append`?**
8. **What are the 4 positions in `insertAdjacentElement`?**
9. **What is `DocumentFragment` and why is it used for performance?**
10. **How do you toggle a class on an element? Write the dark mode logic.**

---

> 💡 **Tip for Product-Based Interviews:** Pure DOM questions are rare at top companies — but DOM knowledge is tested **through React questions**. When they ask "how does React's virtual DOM differ from the real DOM?" or "why does React batch updates?" — your answer needs this foundation. Understanding reflows, why you avoid direct style mutation, and why `classList` > `style` directly shows you think in performance terms — exactly what product companies want.
