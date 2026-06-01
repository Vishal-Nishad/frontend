# 📘 JavaScript — Call Stack, Callback Hell & Promises
> **Interview-Ready Reference** |  Company Prep

---

## 🧠 What This File Covers

| # | Concept | Interview Weight |
|---|---------|-----------------|
| 1 | Call Stack | ⭐⭐⭐⭐⭐ |
| 2 | JS is Single-Threaded + Event Loop | ⭐⭐⭐⭐⭐ |
| 3 | Callback Hell | ⭐⭐⭐⭐⭐ |
| 4 | Promises — What & Why | ⭐⭐⭐⭐⭐ |
| 5 | `.then()` & `.catch()` | ⭐⭐⭐⭐⭐ |
| 6 | Promise Chaining | ⭐⭐⭐⭐⭐ |
| 7 | Resolve/Reject Values | ⭐⭐⭐⭐⭐ |

---

## 1. The Call Stack — How JS Executes Code

> The **Call Stack** is a data structure that tracks which function is currently running.
> It works **LIFO** — Last In, First Out. The last function pushed is the first to be removed.

```js
function hello() {
    console.log("hello i am vishal");
}
function demo() {
    hello();
}
demo();
```

### Call Stack Trace — Step by Step

```
demo() called
┌─────────────┐
│   hello()   │  ← pushed when hello() is called
│   demo()    │  ← pushed first
│   main()    │  ← global execution context, always at bottom
└─────────────┘

hello() logs "hello i am vishal" → popped
demo() finishes → popped
main() finishes → stack empty
```

### More Complex Example

```js
function one()   { return 1; }
function two()   { return one() + one(); }
function three() { let ans = two() + one(); console.log(ans); }

three(); // 3
```

### Call Stack Trace

```
Step 1: three() called
  Stack: [main, three]

Step 2: three calls two()
  Stack: [main, three, two]

Step 3: two calls one()
  Stack: [main, three, two, one]  → one() returns 1, popped

Step 4: two calls one() again
  Stack: [main, three, two, one]  → one() returns 1, popped
  two() returns 1+1 = 2, popped

Step 5: three calls one()
  Stack: [main, three, one]       → one() returns 1, popped
  ans = 2 + 1 = 3

Step 6: console.log(3)
Console: 3

Stack empties.
```

### 💬 Interview Q: What is a Stack Overflow error?

```js
function infinite() {
    infinite(); // calls itself forever — never pops
}
infinite();
// RangeError: Maximum call stack size exceeded
```

> Each function call pushes a frame onto the stack. Infinite recursion without a base case fills the stack until the browser throws `Maximum call stack size exceeded`. This is literally where the website **Stack Overflow** gets its name.

---

## 2. JS is Single-Threaded — The Event Loop

> JavaScript has **ONE call stack** — it can only do one thing at a time.
> But it can handle async operations (timers, network calls) using the **Event Loop**.

```js
setTimeout(() => { console.log("apna college"); }, 2000);
setTimeout(() => { console.log("i am vishal"); }, 2000);
console.log("hello");
```

### Console Output
```
hello            ← immediately (synchronous)
apna college     ← after 2 seconds
i am vishal      ← after 2 seconds (both fire together, not 4s total)
```

### How This Works — The Full Picture

```
┌─────────────────────────────────────────────────────┐
│                   JS ENGINE                          │
│                                                      │
│  Call Stack          Web APIs          Callback Queue│
│  ──────────          ────────          ──────────────│
│  console.log  →  setTimeout(2000)  →  ()=>log("ac") │
│  (runs now)       (timer runs in      ()=>log("iv") │
│                    background)                       │
│                                                      │
│              Event Loop: when stack is EMPTY,        │
│              moves callbacks from Queue → Stack      │
└─────────────────────────────────────────────────────┘
```

### 💬 Interview Q: If both setTimeouts have 2000ms delay, why do both fire together?

> **Answer:** The timer starts counting from when `setTimeout` is called — both start at nearly the same time, so both fire at ~2000ms. JS doesn't wait for the first one to finish before starting the second timer. They run **concurrently in the Web API layer** and both callbacks arrive in the queue at ~2000ms.

### 💬 Interview Q: Explain the Event Loop in one paragraph.

> JavaScript is single-threaded — only one thing runs at a time on the Call Stack. When async work (timers, fetch, events) is triggered, it's handed off to the **Web APIs** (provided by the browser/Node). When that work completes, the callback is placed in the **Callback Queue**. The **Event Loop** constantly checks: "is the Call Stack empty?" — if yes, it picks the next callback from the queue and pushes it onto the stack to execute. This is how JS handles async without blocking.

---

## 3. Callback Hell — The Problem Promises Solve

### Simple Async (No Problem Yet)

```js
function changeColor(color, delay) {
    setTimeout(() => {
        h1.style.color = color;
    }, delay);
}

changeColor("red",   1000);
changeColor("blue",  2000);
changeColor("green", 3000);
```

> ⚠️ This runs all timers simultaneously starting from page load. "red" at 1s, "blue" at 2s, "green" at 3s — they overlap, not sequential. This is a common beginner mistake.

### Callback Hell — Making It Sequential (The Wrong Way)

```js
function changeColor(color, delay, nextColorChange) {
    setTimeout(() => {
        h1.style.color = color;
        if (nextColorChange) {
            nextColorChange(); // chain the next call manually
        }
    }, delay);
}

// 😱 Callback Hell — the "Pyramid of Doom"
changeColor("red", 1000, () => {
    changeColor("green", 1000, () => {
        changeColor("blue", 1000, () => {
            changeColor("brown", 1000, () => {
                changeColor("orange", 1000);
            });
        });
    });
});
```

### The `saveToDb` Callback Hell — Real Production Problem

```js
function saveToDb(data, success, failure) {
    let internetSpeed = Math.floor(Math.random() * 10 + 1); // 1–10
    if (internetSpeed > 4) {
        success();
    } else {
        failure();
    }
}

// 3 sequential DB saves — each depends on previous succeeding
saveToDb("vishal", () => {
    console.log("success: data1 saved");
    saveToDb("hello vishal", () => {
        console.log("success2: data2 saved");
        saveToDb("how are you", () => {
            console.log("success3: data3 saved");
        }, () => {
            console.log("failure3: weak connection");
        });
    }, () => {
        console.log("failure2: weak connection");
    });
}, () => {
    console.log("failure: data not saved");
});
```

### Console Output (when internetSpeed > 4 all three times)
```
success: data1 saved
success2: data2 saved
success3: data3 saved
```

### Console Output (when internetSpeed ≤ 4 on second call)
```
success: data1 saved
failure2: weak connection
```

### 💬 Interview Q: What is callback hell? Why is it a problem?

> **Answer:** Callback hell (also called "Pyramid of Doom") is when callbacks are nested inside callbacks, creating deep rightward indentation. Problems it causes:
> - **Readability** — hard to follow what happens when
> - **Error handling** — must pass separate `failure` callback at each level — easily forgotten
> - **Maintainability** — adding a 4th or 5th step means deeper nesting
> - **Debugging** — stack traces are confusing with deeply nested anonymous functions

---

## 4. Promises — The Solution

> A **Promise** is an object representing the **eventual success or failure** of an async operation.
> It's a placeholder for a value that doesn't exist yet but will in the future.

### 3 Promise States — Must Know

```
Pending   → initial state, work is in progress
Fulfilled → operation completed successfully (resolve was called)
Rejected  → operation failed (reject was called)

Once fulfilled or rejected, a promise is SETTLED — state never changes again.
```

### Creating a Promise

```js
function savedToDb(data) {
    return new Promise((resolve, reject) => {
        // Promise constructor always receives these two function arguments
        // You MUST call resolve() or reject() — otherwise promise stays Pending forever

        let internetSpeed = Math.floor(Math.random() * 10 + 1); // 1-10

        if (internetSpeed > 4) {
            resolve("success: data was saved");   // fulfills the promise
        } else {
            reject("failure: weak connection");   // rejects the promise
        }
    });
}
```

### 🔍 What Happens Inside

```
new Promise((resolve, reject) => { ... })
         ↑
         Constructor runs your function immediately (synchronously)
         Your function does async work
         Calls resolve(value) → Promise state: Pending → Fulfilled
         Calls reject(reason) → Promise state: Pending → Rejected
```

### 💬 Interview Q: What happens if you never call `resolve` or `reject`?

```js
const forever = new Promise((resolve, reject) => {
    // never call resolve or reject
});
console.log(forever); // Promise { <pending> }
// .then() and .catch() never fire — memory leak risk in production
```

> In production, always ensure every code path calls either `resolve` or `reject`. Unresolved promises cause subtle bugs and memory leaks.

---

## 5. `.then()` and `.catch()` — Consuming Promises

```js
let request = savedToDb("hi vishal"); // returns a Promise object

request
    .then((result) => {
        // runs if resolve() was called
        console.log("promise was resolved");
        console.log(result); // "success: data was saved"
        console.log(request); // Promise { 'success: data was saved' }
    })
    .catch((error) => {
        // runs if reject() was called
        console.log("promise was rejected");
        console.log(error); // "failure: weak connection"
        console.log(request); // Promise { <rejected> 'failure: weak connection' }
    });
```

### Console Output (when internetSpeed > 4)
```
promise was resolved
success: data was saved
Promise { 'success: data was saved' }
```

### Console Output (when internetSpeed ≤ 4)
```
promise was rejected
failure: weak connection
Promise { <rejected> 'failure: weak connection' }
```

### Shorthand — Chain Directly on the Function Call

```js
// No need to store in variable — chain directly
savedToDb("vishal")
    .then((result) => {
        console.log("direct: promise was resolved");
        console.log(result); // "success: data was saved"
    })
    .catch((error) => {
        console.log("direct: promise was rejected");
        console.log(error);
    });
```

### 💬 Interview Q: What does `.then()` return?

> **Answer:** `.then()` always returns a **new Promise**. This is what makes chaining possible. If your `.then()` callback returns a value, the next `.then()` receives it. If it returns a Promise, the chain waits for that Promise to settle before continuing.

---

## 6. Promise Chaining — The Right Way to Sequence Async Work

### Wrong Way — Nested `.then()` (Still Callback Hell)

```js
savedToDb("raven")
    .then(() => {
        console.log("raven data1 saved.");
        savedToDb("raven logged in").then(() => {  // ❌ nested — bad
            console.log("raven data2 saved");
        });
    })
    .catch(() => {
        console.log("promise was rejected");
    });
```

> ⚠️ Nesting `.then()` inside another `.then()` recreates callback hell — just with promises. The `.catch()` at the end also won't catch errors from the inner `.then()`.

### ✅ Correct Way — Flat Chain with `return`

```js
savedToDb("kevin")
    .then((result) => {
        console.log("kevin data1 saved.");
        console.log("result:", result); // "success: data was saved"
        return savedToDb("kevin logged in"); // ← RETURN the next promise
    })
    .then((result) => {
        console.log("kevin data2 saved");
        console.log("result:", result); // "success: data was saved"
        return savedToDb("hello welcome"); // ← RETURN again
    })
    .then((result) => {
        console.log("kevin data3 saved");
        console.log("result:", result);
    })
    .catch((error) => {
        // ONE catch handles errors from ANY step above
        console.log("kevin promise was rejected");
        console.log("error:", error); // "failure: weak connection"
    });
```

### Console Output (all succeed)
```
kevin data1 saved.
result: success: data was saved
kevin data2 saved
result: success: data was saved
kevin data3 saved
result: success: data was saved
```

### Console Output (step 2 fails)
```
kevin data1 saved.
result: success: data was saved
kevin promise was rejected
error: failure: weak connection
```

### 🔑 The Critical Rule — Always `return` the Next Promise

```js
// ❌ Without return — chains break, run independently
.then(() => {
    savedToDb("step2"); // not returned — next .then fires immediately
})
.then(() => {
    // runs immediately, doesn't wait for step2 to finish
})

// ✅ With return — chains wait properly
.then(() => {
    return savedToDb("step2"); // returned — next .then waits
})
.then(() => {
    // waits for step2 promise to settle before running
})
```

### ONE `.catch()` Covers Everything

```js
// Any rejection anywhere in the chain falls through to .catch()
// No need to handle errors at every individual step
savedToDb("1").then(() => {
    return savedToDb("2");
}).then(() => {
    return savedToDb("3");   // if this rejects...
}).then(() => {
    return savedToDb("4");   // ...this and below are skipped
}).catch((err) => {
    console.log("Something failed:", err); // ← lands here
});
```

### 💬 Interview Q: What is the difference between these two?

```js
// Option A
promise
    .then(fn1)
    .then(fn2)
    .catch(handleError);

// Option B
promise
    .then(fn1, handleError)
    .then(fn2);
```

> **Answer:**
> - **Option A** — `catch` handles errors from both `fn1` AND `fn2`. This is the standard pattern.
> - **Option B** — `handleError` only handles errors from the original `promise` — not from `fn1`. Errors inside `fn1` are NOT caught. Avoid Option B unless intentional.

---

## 7. Refactoring Callback Hell → Promise Chain

### Before (Callback Hell)
```js
changeColor("red", 1000, () => {
    changeColor("green", 1000, () => {
        changeColor("blue", 1000, () => {
            changeColor("brown", 1000, () => {
                changeColor("orange", 1000);
            });
        });
    });
});
```

### After (Promise Chain)

```js
function changeColorPromise(color, delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            h1.style.color = color;
            resolve("color changed"); // always resolves — no failure case
        }, delay);
    });
}

changeColorPromise("red", 1000)
    .then((result) => {
        console.log(result); // "color changed"
        return changeColorPromise("orange", 1000);
    })
    .then(() => {
        return changeColorPromise("green", 1000);
    })
    .then(() => {
        return changeColorPromise("blue", 1000);
    })
    .then(() => {
        return changeColorPromise("black", 1000);
    })
    .then(() => {
        console.log("all colors complete");
    });
```

### Console Output
```
color changed     ← after 1s (red)
                  ← after 1s (orange)
                  ← after 1s (green)
                  ← after 1s (blue)
all colors complete ← after 1s (black)
// Total: 5 seconds, perfectly sequential
```

---

## 8. Promise Utility Methods — Beyond Basic Chaining

These are asked in senior-level interviews:

```js
// Promise.all — runs ALL in parallel, waits for ALL to succeed
// Fails fast — if ANY one rejects, entire Promise.all rejects
Promise.all([
    savedToDb("user"),
    savedToDb("settings"),
    savedToDb("preferences")
]).then((results) => {
    console.log(results); // ["success...", "success...", "success..."]
}).catch((err) => {
    console.log("One failed:", err); // entire chain fails
});

// Promise.allSettled — runs ALL, waits for ALL to settle regardless of success/fail
Promise.allSettled([
    savedToDb("user"),
    savedToDb("settings")
]).then((results) => {
    results.forEach(r => {
        if (r.status === "fulfilled") console.log("✅", r.value);
        else                          console.log("❌", r.reason);
    });
});

// Promise.race — resolves/rejects as soon as FIRST one settles
Promise.race([
    savedToDb("fast"),
    savedToDb("slow")
]).then((result) => {
    console.log("First to finish:", result);
});

// Promise.any — resolves as soon as FIRST one SUCCEEDS (ignores rejections)
Promise.any([
    savedToDb("server1"),
    savedToDb("server2")
]).then((result) => {
    console.log("First success:", result);
});
```

### When to Use Which

| Method | Use Case |
|--------|----------|
| `Promise.all` | Load all required data in parallel (fail if any missing) |
| `Promise.allSettled` | Run all, report each result individually |
| `Promise.race` | Timeout pattern — race request against a timer |
| `Promise.any` | Try multiple servers — use whichever responds first |

---

## 🏭 Production Example — Login Flow with Promise Chain

```js
function validateCredentials(email, password) {
    return new Promise((resolve, reject) => {
        if (!email || !password) reject("Fields cannot be empty");
        else if (!email.includes("@")) reject("Invalid email format");
        else resolve({ email, password });
    });
}

function authenticateUser(credentials) {
    return fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    }).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    });
}

function loadDashboard(userData) {
    return fetch(`/api/dashboard/${userData.userId}`)
        .then(res => res.json());
}

// Clean flat chain — each step returns a promise
validateCredentials("vishal@gmail.com", "abc123")
    .then(credentials  => authenticateUser(credentials))
    .then(userData     => loadDashboard(userData))
    .then(dashboard    => {
        console.log("Welcome!", dashboard.username);
        renderDashboard(dashboard);
    })
    .catch(error => {
        console.error("Login failed:", error);
        showErrorMessage(error);
    })
    .finally(() => {
        hideLoadingSpinner(); // always runs — success or failure
    });
```

---

## 🔁 Concept Recap — Quick Cheatsheet

```
CALL STACK
  LIFO — Last In, First Out
  One function executes at a time
  Stack Overflow = infinite recursion = stack fills up

SINGLE THREADED + EVENT LOOP
  JS has ONE call stack — can't multitask
  Async work goes to Web APIs (timers, fetch, events)
  Event Loop moves completed callbacks → Callback Queue → Stack
  setTimeout(fn, 0) still runs AFTER current synchronous code

CALLBACK HELL
  Callbacks nested inside callbacks = Pyramid of Doom
  Problems: unreadable, error handling nightmare, unmaintainable

PROMISE
  new Promise((resolve, reject) => { ... })
  States: Pending → Fulfilled (resolve) or Rejected (reject)
  MUST call resolve or reject — or stays pending forever

CONSUMING PROMISES
  .then(result => ...)     → runs on resolve
  .catch(error => ...)     → runs on reject
  .finally(() => ...)      → ALWAYS runs (cleanup)

PROMISE CHAINING
  return the next promise inside .then()       ← critical rule
  ONE .catch() at end handles ALL errors above
  Never nest .then() inside .then()            ← recreates callback hell

PROMISE UTILITIES
  Promise.all([p1,p2])        → all must succeed, parallel
  Promise.allSettled([p1,p2]) → all run, report each result
  Promise.race([p1,p2])       → first to settle wins
  Promise.any([p1,p2])        → first to SUCCEED wins
```

---

## 🎯 Must-Know Interview Questions from This File

1. **What is the Call Stack? What is a Stack Overflow?**
2. **JavaScript is single-threaded. How does it handle async operations?**
3. **Explain the Event Loop. What is the Callback Queue?**
4. **What is callback hell? What problems does it cause?**
5. **What is a Promise? What are its 3 states?**
6. **What happens if you never call `resolve` or `reject` inside a Promise?**
7. **What does `.then()` return? Why does this enable chaining?**
8. **What is the critical rule when chaining Promises? What happens without `return`?**
9. **How does ONE `.catch()` handle errors from multiple `.then()` steps?**
10. **What is the difference between `Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any`?**

---

> 💡 **Tip for  Interviews:** Promises and the Event Loop are the **two most asked JS internals topics** at every product company. They test this because it reveals whether you understand *why* JS is designed the way it is — not just how to use it. The follow-up to every Promise question is "now rewrite this using `async/await`" — which is just syntactic sugar over Promises. You've already mastered the hard part. Async/Await will feel like a natural upgrade when you see it next. At companies like Razorpay, Phonepe, and Swiggy — where every feature involves API calls, payment flows, and sequential async operations — this knowledge is non-negotiable.
