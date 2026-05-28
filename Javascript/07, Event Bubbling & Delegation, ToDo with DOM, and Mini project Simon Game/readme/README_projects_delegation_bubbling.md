# 📘 JavaScript — Event Delegation, Bubbling & Real Projects
> **Interview-Ready Reference** | Product-Based Company Prep

---

## 🧠 What This File Covers

| # | Concept | Interview Weight |
|---|---------|-----------------|
| 1 | Project Architecture — Simon Game | ⭐⭐⭐⭐⭐ |
| 2 | Game State Management | ⭐⭐⭐⭐⭐ |
| 3 | Sequence Comparison Logic | ⭐⭐⭐⭐⭐ |
| 4 | Dynamic Element Creation — Todo App | ⭐⭐⭐⭐⭐ |
| 5 | Event Delegation (most important pattern) | ⭐⭐⭐⭐⭐ |
| 6 | Event Bubbling | ⭐⭐⭐⭐⭐ |
| 7 | `stopPropagation` | ⭐⭐⭐⭐⭐ |

---

## 1. Simon Game — Full Architecture Breakdown

> Before reading the code line by line, understand the **data flow**. Every project interview starts with "walk me through your architecture."

```
GAME STATE (variables)
─────────────────────
gameSeq[]   → the correct sequence the game generates  e.g. ["red","yellow","red"]
userSeq[]   → what the user has clicked so far         e.g. ["red","yellow"]
level       → current level number
started     → has the game begun (boolean gate)

GAME LOOP
─────────
keypress → levelUp() → flash correct color → user clicks → checkAns() → levelUp() or Game Over
```

### State Variables Explained

```js
let userSeq  = [];              // resets every level
let gameSeq  = [];              // accumulates across levels — never resets mid-game
let btns     = ["yellow", "red", "purple", "green"]; // color names = CSS class names
let started  = false;           // gate — prevents levelUp before game begins
let level    = 0;               // starts at 0, incremented INSIDE levelUp
```

### 💬 Interview Q: Why are `gameSeq` and `userSeq` stored as arrays at module scope (outside functions)?

> **Answer:** They need to **persist across multiple function calls and events**. If they were inside a function, they'd reset every time the function ran. Variables at module/global scope act as the **state** of the application — shared between all functions. This is exactly the same concept as React's `useState` — a value that persists between renders.

---

## 2. Game Start — Keypress Gate Pattern

```js
document.addEventListener("keypress", function () {
    if (started == false) {
        console.log("game started");
        started = true;
        levelUp();
    }
});
```

### Console Output (on first key press)
```
game started
["red"]          ← gameSeq after first levelUp
```

### 🔍 Why the `if (started == false)` Gate?

> Without this check, pressing any key during the game would call `levelUp()` again, skipping levels. The boolean gate ensures `levelUp()` is only triggered from keypress **once** — after that, `levelUp()` is called internally by `checkAns()`.

### 🏭 Production Pattern — Feature Flags / One-Time Initialisation

```js
// Same gate pattern used in production
let isInitialized = false;

function initApp() {
    if (isInitialized) return; // guard clause — same as started == false
    isInitialized = true;

    connectWebSocket();
    loadUserPreferences();
    startAnalytics();
}

document.addEventListener("DOMContentLoaded", initApp);
```

---

## 3. `levelUp` — Game Logic Core

```js
function levelUp() {
    userSeq = [];          // ✅ reset user input for THIS level only
    level++;               // increment before display so it shows Level 1 not Level 0
    h2.innerText = `Level ${level}`;

    let randIdx   = Math.floor(Math.random() * 3); // 0, 1, or 2 (bug: should be 4)
    let randColor = btns[randIdx];                 // "yellow", "red", or "purple"
    let randbtn   = document.querySelector(`.${randColor}`); // DOM element by class

    gameSeq.push(randColor); // ADD to game sequence — grows each level
    console.log(gameSeq);

    gameFlash(randbtn);      // visually flash the correct button
}
```

### Console Output (across 3 levels)
```
["red"]
["red", "yellow"]
["red", "yellow", "red"]
```

### 🐛 Bug Spotting — A Critical Interview Skill

```js
// ❌ Bug in your code:
let randIdx = Math.floor(Math.random() * 3); // generates 0, 1, 2 only
//                                    ↑
//                  Should be 4 — to include index 3 ("green")
// "green" can never be selected! 

// ✅ Fix:
let randIdx = Math.floor(Math.random() * 4); // 0, 1, 2, 3 → all 4 colors
```

> Spotting your own bugs and explaining them in an interview is a **huge green flag**. It shows code review awareness.

### The Flash Functions — CSS Class Toggle Pattern

```js
function gameFlash(btn) {
    btn.classList.add("flash");        // add CSS animation class
    setTimeout(function () {
        btn.classList.remove("flash"); // remove after 300ms
    }, 300);
}

function userFlash(btn) {
    btn.classList.add("userflash");
    setTimeout(function () {
        btn.classList.remove("userflash");
    }, 300);
}
```

> This is the **standard animation pattern** in production — add a class to trigger a CSS animation, remove it after the duration so it can be re-triggered. Used everywhere from button ripples to toast notifications.

---

## 4. `checkAns` — Sequence Comparison Logic (Most Important Function)

```js
function checkAns(idx) {
    // Check CURRENT position only — not the whole array
    if (userSeq[idx] === gameSeq[idx]) {
        // Current button is correct — now check if level is complete
        if (userSeq.length === gameSeq.length) {
            setTimeout(levelUp, 500); // level complete — advance after 500ms
        }
        // If lengths differ, just wait for more user input
    } else {
        // Wrong button — Game Over
        h2.innerHTML = `Game Over! Your Score was <b>${level - 1}</b> <br> Press any key to start.`;

        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function () {
            document.querySelector("body").style.backgroundColor = "white";
        }, 300); // flash body red for 300ms

        reset();
    }
}
```

### Step-by-Step Trace (Level 3, sequence = ["red","yellow","red"])

```
User clicks "red"   → userSeq = ["red"]
  checkAns(0): userSeq[0]==="red" === gameSeq[0]==="red" ✅
  lengths: 1 !== 3 → wait

User clicks "yellow" → userSeq = ["red","yellow"]
  checkAns(1): userSeq[1]==="yellow" === gameSeq[1]==="yellow" ✅
  lengths: 2 !== 3 → wait

User clicks "red"   → userSeq = ["red","yellow","red"]
  checkAns(2): userSeq[2]==="red" === gameSeq[2]==="red" ✅
  lengths: 3 === 3 → setTimeout(levelUp, 500) 🎉

User clicks "green" → userSeq = ["red","green"]
  checkAns(1): "green" !== "yellow" → Game Over ❌
```

### 💬 Interview Q: Why does `checkAns` receive `idx` instead of comparing the full arrays?

> **Answer:** Because the user clicks **one button at a time**. We validate each click immediately as it happens — not after all buttons are clicked. This gives instant feedback and avoids waiting for a full array comparison. We only need to know: "was the last click at position `idx` correct?"

### 🏭 Production Pattern — Real-Time Input Validation

```js
// Same per-index validation used in OTP inputs
function validateOTPDigit(index, digit) {
    if (digit === expectedOTP[index]) {
        inputs[index].classList.add("correct");
        if (index === expectedOTP.length - 1) {
            submitOTP(); // all digits correct
        }
    } else {
        inputs[index].classList.add("error");
        shakeForm();
    }
}
```

---

## 5. `btnPress` — Capturing User Input via `this`

```js
function btnPress() {
    let btn = this; // `this` = the button that was clicked

    userColor = btn.getAttribute("id"); // read color from element's id attribute
    userSeq.push(userColor);            // add to user sequence
    checkAns(userSeq.length - 1);       // validate at current index
    userFlash(btn);                     // visual feedback
}

// Attach to ALL game buttons
const allBtns = document.querySelectorAll(".btn");
for (btn of allBtns) {
    btn.addEventListener("click", btnPress);
}
```

### ⚠️ `for (btn of allBtns)` — Implicit Global Bug

```js
// ❌ Your code — btn is NOT declared with let/const/var
for (btn of allBtns) { ... }
// btn leaks into global scope — could conflict with other variables

// ✅ Always declare loop variable
for (let btn of allBtns) { ... }
```

---

## 6. `reset` — Restoring Initial State

```js
function reset() {
    started = false; // allow keypress to restart game
    gameSeq = [];    // clear game sequence
    userSeq = [];    // clear user sequence
    level = 0;       // back to zero
}
```

### 🏭 Production Pattern — Reset is the Mirror of Init

```js
// In every stateful app, reset mirrors initialization
function initGame() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}

function reset() {
    initGame(); // just call init — DRY principle
}
// Both should produce identical state — one rule, one place
```

---

## 7. Todo App — Dynamic Elements + Why Delegation is Needed

```js
const btn = document.querySelector("button");
const ul  = document.querySelector("ul");
const inp = document.querySelector("input");

btn.addEventListener("click", function () {
    // Create new <li> with a delete button inside
    const item   = document.createElement("li");
    item.innerText = inp.value;

    const delBtn = document.createElement("button");
    delBtn.innerText = "delete";
    delBtn.classList.add("delete");

    item.appendChild(delBtn); // delete button inside <li>
    ul.appendChild(item);     // <li> inside <ul>

    console.log(inp.value);
    inp.value = ""; // clear input after adding
});
```

### The Problem — Why This Doesn't Work

```js
// ❌ This is commented out in your code — and for good reason
const delBtns = document.querySelectorAll(".delete");
for (delbtn of delBtns) {
    delbtn.addEventListener("click", function () {
        let par = this.parentElement;
        par.remove();
    });
}
```

> `querySelectorAll(".delete")` runs **once at page load** — when there are zero delete buttons.
> Delete buttons are created **dynamically** after that. The listener never attaches to them.
> This is exactly the problem **Event Delegation** solves.

### Console Output (broken approach)
```
// Clicking delete → nothing happens
// No listener was ever attached to dynamically created buttons
```

---

## 8. Event Delegation — The Solution & Most Important Pattern

```js
// ✅ ONE listener on the PARENT <ul> — catches all children, present AND future
ul.addEventListener("click", function (event) {
    if (event.target.nodeName === "BUTTON") {
        // event.target = the actual element clicked (the delete button)
        // nodeName returns uppercase tag name: "BUTTON", "LI", "DIV"
        let listItem = event.target.parentElement; // <li> containing the button
        listItem.remove();
        console.log("deleted");
    }
});
```

### Console Output (clicking delete on a todo item)
```
deleted
```

### How It Works — Event Bubbling Powers Delegation

```
User clicks "delete" button inside <li> inside <ul>

Event travels UP (bubbles):
  button  → fires event
  li      → event passes through
  ul      → listener fires! ← we catch it here
  div
  body
  document
```

### Visual Flow

```
<ul>  ← listener lives here, catches everything below
  <li>Task 1 <button class="delete">delete</button></li>
  <li>Task 2 <button class="delete">delete</button></li>
  <li>Task 3 <button class="delete">delete</button></li>  ← dynamically added
```

### 💬 Interview Q: Why does `event.target.nodeName` return uppercase?

```js
// nodeName always returns UPPERCASE for HTML elements
event.target.nodeName === "BUTTON" // ✅ correct
event.target.nodeName === "button" // ❌ always false

// Alternative — use tagName (also uppercase) or matches()
event.target.tagName === "BUTTON"         // same
event.target.matches(".delete")           // ✅ matches CSS selector — more flexible
event.target.classList.contains("delete") // ✅ check by class
```

### 🏭 Production Example — Twitter-style Feed (1000 items, one listener)

```js
const feed = document.querySelector("#feed");

// ONE listener handles like, retweet, reply on ALL posts — including new ones loaded
feed.addEventListener("click", function (e) {
    const likeBtn    = e.target.closest(".like-btn");
    const retweetBtn = e.target.closest(".retweet-btn");
    const postId     = e.target.closest(".post")?.dataset.id;

    if (likeBtn && postId) {
        likeBtn.classList.toggle("liked");
        updateLikeCount(postId);
    }

    if (retweetBtn && postId) {
        retweetPost(postId);
    }
});
```

> `closest()` is the production upgrade to `parentElement` — walks UP the tree and finds the nearest ancestor matching a selector. Perfect for delegated events where the click target might be a child of the target element.

### 💬 Interview Q: What is the difference between `event.target` and `event.currentTarget` in delegation?

```js
ul.addEventListener("click", function (e) {
    console.log(e.target);        // the DELETE BUTTON — what was actually clicked
    console.log(e.currentTarget); // the UL — where the listener is attached
    // They are DIFFERENT when using event delegation
});
```

---

## 9. Event Bubbling & `stopPropagation`

```js
const div = document.querySelector("div");
const ul  = document.querySelector("ul");
const lis = document.querySelectorAll("li");

div.addEventListener("click", function () {
    console.log("div was clicked");
});

ul.addEventListener("click", function (event) {
    event.stopPropagation(); // stops event here — div listener never fires
    console.log("ul was clicked");
});

for (li of lis) {
    li.addEventListener("click", function (event) {
        event.stopPropagation(); // stops here — ul and div listeners don't fire
        console.log("li was clicked");
    });
}
```

### Console Output Comparison

```
// Clicking an <li>:
li was clicked          ← stopPropagation stops here
// ul and div listeners DON'T fire

// Clicking <ul> (but not on <li>):
ul was clicked          ← stopPropagation stops here
// div listener DOESN'T fire

// Clicking <div> (but not ul or li):
div was clicked         ← nothing to stop, fires normally
```

### Bubbling Visualized

```
Without stopPropagation (click <li>):
  li  → "li was clicked"
  ul  → "ul was clicked"
  div → "div was clicked"

With stopPropagation (click <li>):
  li  → "li was clicked"  🛑 stops here
  ul  → ❌ never fires
  div → ❌ never fires
```

### 💬 Interview Q: When should you use `stopPropagation`? When should you avoid it?

> **Use it when:**
> - A child action shouldn't trigger the parent's handler (e.g., clicking a card's delete button shouldn't also open the card)
> - Modal close-on-backdrop-click pattern (click inside modal shouldn't close it)

> **Avoid it when:**
> - You're using event delegation — `stopPropagation` on children will break the parent's delegated listener
> - It makes debugging harder and creates invisible behavior contracts

```js
// ✅ Correct use — delete button on a card shouldn't open the card
card.addEventListener("click", openCard);

deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // don't open card — just delete
    deleteCard(card.dataset.id);
});
```

### `stopPropagation` vs `preventDefault` — Never Confuse These

```js
event.preventDefault();   // Stops browser DEFAULT action (form reload, link navigate)
                           // Does NOT stop bubbling

event.stopPropagation();  // Stops event from bubbling UP the DOM tree
                           // Does NOT prevent default browser action

event.stopImmediatePropagation(); // Stops bubbling AND prevents other listeners
                                   // on the SAME element from firing
```

---

## 🔁 Full Project Summary — Simon Game Data Flow

```
PAGE LOAD
  → variables initialized (gameSeq=[], userSeq=[], level=0, started=false)
  → event listeners attached to all .btn elements

KEYPRESS (first time)
  → started = true
  → levelUp() called
      → userSeq reset to []
      → level++ (now 1)
      → random color picked → pushed to gameSeq
      → correct button flashes via gameFlash()

USER CLICKS A BUTTON
  → btnPress() fires (this = clicked button)
  → color read from element id
  → pushed to userSeq
  → checkAns(userSeq.length - 1) called
      → if CORRECT + level complete → setTimeout(levelUp, 500)
      → if CORRECT + level incomplete → wait for more clicks
      → if WRONG → Game Over UI + reset()

RESET
  → started=false, gameSeq=[], userSeq=[], level=0
  → next keypress restarts everything
```

---

## 🔁 Concept Recap — Quick Cheatsheet

```
STATE MANAGEMENT
  Module-scope variables    → persist across function calls (like useState)
  Boolean gate              → if(!started) { started=true; init(); }
  Reset = mirror of init    → set all state back to starting values

EVENT DELEGATION
  Problem  → dynamically created elements have no listeners
  Solution → attach ONE listener to stable PARENT
  Catch    → use e.target to identify which child was clicked
  Check    → e.target.nodeName === "BUTTON"  (uppercase!)
           → e.target.matches(".class")       (more flexible)
           → e.target.closest(".parent")      (production standard)

BUBBLING
  Direction → child → parent → grandparent → document
  Control   → e.stopPropagation()  stops bubble at current element
  Danger    → breaks event delegation if used on children

stopPropagation   → stops bubbling (event travel)
preventDefault    → stops browser default action
Both are different — can use both together if needed

nodeName vs tagName → both uppercase, both work
closest(selector)   → walks UP tree, finds nearest matching ancestor
```

---

## 🎯 Must-Know Interview Questions from This File

1. **What is event delegation? Why is it better than attaching listeners to each element?**
2. **Why can't you attach event listeners to dynamically created elements directly?**
3. **What is event bubbling? In which direction does it travel?**
4. **What is the difference between `stopPropagation` and `preventDefault`?**
5. **What is `e.target` vs `e.currentTarget` in a delegated event listener?**
6. **Why does `nodeName` return uppercase? What's the alternative?**
7. **What does `closest()` do? How is it useful in event delegation?**
8. **What is a boolean gate pattern? Where is it used in production?**
9. **In the Simon Game, why does `checkAns` take an index instead of comparing full arrays?**
10. **Find and explain the bug in this code:** `Math.floor(Math.random() * 3)` for 4 buttons.

---

> 💡 **Tip for Product-Based Interviews:** The Simon Game and Todo App are the two most common **"walk me through your project"** mini-projects asked at product companies. Interviewers won't just ask "does it work" — they'll ask "how is state managed?", "how does the sequence comparison work?", "why event delegation for the delete buttons?" and "what bugs exist?". Being able to spot the `* 3` vs `* 4` bug yourself, explain the delegation pattern, and describe state as "module-scoped variables that persist across calls" — these answers directly map to how React, Redux, and real frontend architecture works.
