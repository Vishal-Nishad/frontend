# 📘 JavaScript — Async/Await, JSON & Fetch API

---

## 🧠 What This File Covers

| # | Concept | Interview Weight |
|---|---------|-----------------|
| 1 | `async` Functions | ⭐⭐⭐⭐⭐ |
| 2 | `await` Keyword | ⭐⭐⭐⭐⭐ |
| 3 | `await` vs No `await` — Execution Order | ⭐⭐⭐⭐⭐ |
| 4 | Error Handling with `try/catch` in async | ⭐⭐⭐⭐⭐ |
| 5 | JSON — `parse` & `stringify` | ⭐⭐⭐⭐⭐ |
| 6 | AJAX — What It Means | ⭐⭐⭐ |
| 7 | `fetch` API — Real API Calls | ⭐⭐⭐⭐⭐ |

---

## 1. `async` Functions — Always Return a Promise

> Prefix any function with `async` and it **automatically wraps its return value in a Promise**.
> Even if you return a plain string, JS silently wraps it: `return "hello"` → `Promise.resolve("hello")`.

```js
// Regular async function
async function greet() {
    return "hello world!"; // becomes Promise { 'hello world!' }
}

// Arrow async function — same behavior
const demo = async () => {
    return "hello from arrow function";
};

// Async function with an error inside
async function asyncDemo() {
    ehllo.hell(); // ReferenceError — ehllo is not defined
    return "hello"; // never reaches here
}
```

### Consuming All Three

```js
greet()
    .then(result => {
        console.log("promise was resolved");
        console.log("promise result is:", result);
    })
    .catch(err => console.log("rejected:", err));

asyncDemo()
    .then(result => console.log("resolved:", result))
    .catch(err  => console.log("promise was rejected with err:", err));

demo()
    .then(result => console.log("promise result is:", result))
    .catch(err  => console.log("rejected:", err));
```

### Console Output
```
promise was resolved
promise result is: hello world!

promise was rejected with err: ReferenceError: ehllo is not defined

promise was resolved
promise result is: hello from arrow function
```

### 🔍 What Happens Internally

```
async function greet() { return "hello" }
          ↕  JS silently converts this to:
function greet() { return Promise.resolve("hello") }

async function asyncDemo() { ehllo.hell() }
          ↕  JS silently converts this to:
function asyncDemo() { return Promise.reject(new ReferenceError(...)) }
```

### 💬 Interview Q: Does an `async` function that has no `return` statement return anything?

```js
async function doWork() {
    console.log("working...");
    // no return
}

doWork().then(result => {
    console.log(result); // undefined
});
// Output:
// working...
// undefined
```

> Yes — it returns `Promise { undefined }`. Every `async` function returns a Promise, no exceptions. The Promise resolves with `undefined` if nothing is returned.

### 💬 Interview Q: What is the difference between a regular function and an `async` function?

| | Regular Function | `async` Function |
|--|-----------------|-----------------|
| Return type | Whatever you return | Always a Promise |
| Can use `await`? | ❌ No | ✅ Yes |
| Error handling | try/catch | try/catch OR `.catch()` |
| Return "hello" | `"hello"` | `Promise { 'hello' }` |
| Throw error | Crashes synchronously | Promise rejects |

---

## 2. `await` — Pause Until the Promise Settles

> `await` can only be used **inside an `async` function**.
> It pauses execution of that function until the awaited Promise resolves, then returns the resolved value.
> The rest of the program does NOT pause — only the current `async` function waits.

```js
async function randomNum() {
    return new Promise((resolve) => {
        setTimeout(() => {
            let num = Math.floor(Math.random() * 100);
            console.log(num);
            resolve();
        }, 1000);
    });
}
```

---

## 3. `await` vs No `await` — The Execution Order Trap

### Without `await` — All Fire Simultaneously

```js
async function demoWithoutAwait() {
    randomNum();  // starts timer 1 — doesn't wait
    randomNum();  // starts timer 2 — doesn't wait
    randomNum();  // starts timer 3 — doesn't wait
    console.log("hello");
}

demoWithoutAwait();
console.log("  hello");
```

### Console Output — Without `await`
```
  hello       ← synchronous code after demoWithoutAwait() call runs first
hello         ← console.log("hello") inside demoWithoutAwait
42            ← all three random numbers appear together after ~1s
17
89
```

> All three timers start at nearly the same time — all fire after ~1000ms together.

### With `await` — Each Waits for the Previous

```js
async function demoWithAwait() {
    await randomNum();  // waits ~1s
    await randomNum();  // waits another ~1s
    console.log("hello");
    randomNum();        // no await — fires and continues immediately
}

demoWithAwait();
```

### Console Output — With `await`
```
63          ← after 1s (first randomNum)
28          ← after 2s (second randomNum, waited for first)
hello       ← immediately after second resolves
91          ← after ~1s (third runs in background, no await)
```

### 🔍 Side-by-Side Comparison

```
Without await:          With await:
──────────────          ────────────
t=0:   all 3 start      t=0:   first starts
t=1s:  all 3 fire       t=1s:  first fires
       together                 second starts
                         t=2s:  second fires
                                "hello" logged
                                third starts
                         t=3s:  third fires
```

### 💬 Interview Q: Does `await` block the entire JavaScript program?

> **No — this is critical.** `await` only pauses the **current `async` function** — not the entire thread. The event loop continues running other tasks. This is different from a true blocking sleep.

```js
async function slowTask() {
    console.log("task start");
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("task end");
}

slowTask();
console.log("I run immediately — JS is NOT blocked"); // runs right away

// Output:
// task start
// I run immediately — JS is NOT blocked
// task end  (after 2s)
```

---

## 4. Error Handling with `try/catch` in `async/await`

```js
function changeColor(color, delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let num = Math.floor(Math.random() * 5 + 1); // 1–5
            if (num > 3) {
                reject("promise rejected"); // ~40% chance of failure
            }
            h1.style.color = color;
            console.log(`color changed to ${color}`);
            resolve("color changed");
        }, delay);
    });
}

async function demoChangeColor() {
    try {
        await changeColor("red",    1000);
        await changeColor("green",  1000);  // if this rejects...
        await changeColor("orange", 1000);  // ...these two are SKIPPED
        await changeColor("blue",   1000);
    } catch (err) {
        console.log("error caught:");
        console.log(err); // "promise rejected"
    }

    // Code AFTER try/catch always runs — even after an error
    let a = 5;
    console.log(a);           // 5
    console.log("new number");// "new number"
}

demoChangeColor();
```

### Console Output (if "green" rejects)
```
color changed to red
error caught:
promise rejected
5
new number
```

### Console Output (all succeed)
```
color changed to red
color changed to green
color changed to orange
color changed to blue
5
new number
```

### 🔑 Critical Rule — Code After `try/catch` Always Runs

```js
async function example() {
    try {
        await mightFail();
    } catch (err) {
        console.log("caught:", err);
        return; // ← add return if you want to STOP after error
    }
    console.log("this always runs unless you return in catch");
}
```

### async/await vs Promise Chain — Same Thing, Different Syntax

```js
// Promise Chain
changeColor("red", 1000)
    .then(() => changeColor("green", 1000))
    .then(() => changeColor("blue", 1000))
    .catch(err => console.log("error:", err));

// ✅ async/await — same logic, reads like synchronous code
async function run() {
    try {
        await changeColor("red",   1000);
        await changeColor("green", 1000);
        await changeColor("blue",  1000);
    } catch (err) {
        console.log("error:", err);
    }
}
```

### 💬 Interview Q: What's the difference between `.catch()` on a Promise and `try/catch` in async/await?

> They are functionally equivalent — `async/await` with `try/catch` is just syntactic sugar over Promise `.then/.catch`. Use `try/catch` with `async/await` — it reads linearly and handles multiple awaited calls with one catch block.

### 💬 Interview Q: What happens if you `await` a non-Promise value?

```js
async function demo() {
    const result = await 42;     // 42 is not a Promise
    console.log(result);          // 42 — await wraps it in Promise.resolve(42)

    const str = await "hello";
    console.log(str);             // "hello"
}
// await on a plain value is harmless — it just resolves immediately
```

---

## 5. JSON — `parse` and `stringify`

> **JSON (JavaScript Object Notation)** is the universal data format for APIs.
> Every API call sends and receives JSON — understanding parse/stringify is non-negotiable.

### `JSON.parse()` — String → JS Object

```js
// What you RECEIVE from an API — it arrives as a raw string
let jsonRes = '{"fact":"hello i am vishal this is json parse", "length":78}';

console.log(typeof jsonRes);       // "string"
console.log(jsonRes.fact);         // undefined — it's a string, not an object!

let validRes = JSON.parse(jsonRes); // convert string → JS object
console.log(typeof validRes);       // "object"
console.log(validRes.fact);         // "hello i am vishal this is json parse"
console.log(validRes.length);       // 78
```

### Console Output
```
string
undefined
object
hello i am vishal this is json parse
78
```

### `JSON.stringify()` — JS Object → String

```js
// What you SEND to an API — must be a string
const student = {
    name:  "vishal",
    marks: 100,
};

console.log(typeof student);              // "object"
console.log(JSON.stringify(student));     // '{"name":"vishal","marks":100}'
console.log(typeof JSON.stringify(student)); // "string"
```

### Console Output
```
object
{"name":"vishal","marks":100}
string
```

### 🏭 Production — Full Request/Response Cycle

```js
// SENDING data to API → must stringify
const payload = { email: "v@gmail.com", password: "abc123" };

fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)   // ← object → string for sending
});

// RECEIVING data from API → must parse
fetch("/api/user")
    .then(res  => res.json())       // ← res.json() does JSON.parse internally
    .then(data => console.log(data.name)); // now it's a JS object
```

### JSON Rules — What's Valid and What's Not

```js
// ✅ Valid JSON — keys must be double-quoted strings
'{"name": "vishal", "age": 23, "active": true, "score": null}'

// ❌ Invalid JSON — common mistakes
'{ name: "vishal" }'       // keys not quoted
"{ 'name': 'vishal' }"    // single quotes not allowed
'{ "fn": function(){} }'  // functions not allowed
'{ "date": undefined }'   // undefined not allowed

// JSON.stringify handles invalid types silently
const obj = { name: "v", fn: function(){}, val: undefined };
console.log(JSON.stringify(obj)); // '{"name":"v"}' — fn and undefined are dropped!
```

### 💬 Interview Q: What is the difference between `JSON.parse` and `JSON.stringify`?

| | `JSON.parse(string)` | `JSON.stringify(object)` |
|--|---------------------|------------------------|
| Input | JSON string | JS object/array |
| Output | JS object | JSON string |
| Use when | You RECEIVE data (API response) | You SEND data (API request body) |
| Throws if | Invalid JSON string | Circular references |

---

## 6. AJAX — What the Term Actually Means

> **AJAX = Asynchronous JavaScript and XML**
> It describes the technique of fetching data from a server **without reloading the page**.
>
> Despite the name — modern AJAX uses **JSON** (not XML). The term stuck because it was coined in 2005 when XML was standard. Today "AJAX" just means any async data exchange between browser and server using JS.

```
Old AJAX flow (2005):     Modern AJAX flow (now):
──────────────────        ──────────────────────
Browser → request       Browser → request
Server  → XML           Server  → JSON
JS      → parse XML     JS      → JSON.parse() or res.json()
JS      → update DOM    JS      → update DOM
```

---

## 7. `fetch` API — Making Real API Calls

> `fetch` is the modern built-in way to make HTTP requests in JavaScript.
> It returns a **Promise** that resolves to a `Response` object.
> **Two awaits are always needed** — one for the response, one for the body.

```js
const url = "https://catfact.ninja/fact";

async function getFacts() {
    try {
        // Step 1: await the HTTP response (headers arrive)
        let res  = await fetch(url);
        // res is a Response object — body not parsed yet

        // Step 2: await parsing the body as JSON
        let data = await res.json();
        // now data is a real JS object

        console.log("full data json:", data);
        // { fact: "Cats can rotate their ears...", length: 68 }

        console.log("data.fact:", data.fact);
        // "Cats can rotate their ears..."

        // Sequential second call — waits for first to complete
        let res2  = await fetch(url);
        let data2 = await res2.json();
        console.log("full data json:", data2);
        console.log("data.fact:", data2.fact);

    } catch (e) {
        console.log("error -", e); // network error, invalid JSON, etc.
    }

    console.log("bye"); // always runs
}

getFacts();
```

### Console Output (approximate)
```
full data json:  { fact: 'Cats can rotate their ears 180 degrees.', length: 42 }
data.fact:       Cats can rotate their ears 180 degrees.
full data json:  { fact: 'A group of cats is called a clowder.', length: 36 }
data.fact:       A group of cats is called a clowder.
bye
```

### Why Two `await`s Are Always Needed

```
fetch(url) → Promise<Response>
                ↓ await #1
             Response { status: 200, headers: {...}, body: ReadableStream }
                ↓ .json() → Promise<Object>
                ↓ await #2
             { fact: "...", length: 42 }   ← actual data
```

> `fetch` resolves when the **response headers** arrive — not when the full body is downloaded. `.json()` reads the body stream and parses it — that's why it's also async and needs its own `await`.

### 🔑 `fetch` Does NOT Reject on HTTP Errors

```js
// ❌ Common mistake — fetch only rejects on NETWORK failure
async function getBadData() {
    try {
        const res = await fetch("https://api.example.com/bad-endpoint");
        // Even 404 or 500 — fetch RESOLVES here!
        console.log(res.status); // 404 — but no error thrown
        const data = await res.json();
    } catch (e) {
        // Only reaches here on network failure (no internet, DNS fail, CORS)
    }
}

// ✅ Always check res.ok in production
async function getDataSafe() {
    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return data;
    } catch (e) {
        console.error("Fetch failed:", e.message);
    }
}
```

### 🏭 Production Example — Full CRUD API Layer

```js
const BASE_URL = "https://api.example.com";

// GET request
async function getUser(userId) {
    try {
        const res = await fetch(`${BASE_URL}/users/${userId}`);
        if (!res.ok) throw new Error(`User not found: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("getUser failed:", err.message);
        return null;
    }
}

// POST request — create new resource
async function createUser(userData) {
    try {
        const res = await fetch(`${BASE_URL}/users`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(userData)  // object → string
        });
        if (!res.ok) throw new Error(`Create failed: ${res.status}`);
        return await res.json(); // newly created user with id
    } catch (err) {
        console.error("createUser failed:", err.message);
        return null;
    }
}

// PATCH request — partial update
async function updateUser(userId, changes) {
    try {
        const res = await fetch(`${BASE_URL}/users/${userId}`, {
            method:  "PATCH",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(changes)
        });
        if (!res.ok) throw new Error(`Update failed: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("updateUser failed:", err.message);
        return null;
    }
}

// DELETE request
async function deleteUser(userId) {
    try {
        const res = await fetch(`${BASE_URL}/users/${userId}`, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
        return true;
    } catch (err) {
        console.error("deleteUser failed:", err.message);
        return false;
    }
}
```

### Parallel `fetch` Calls with `Promise.all`

```js
// ❌ Sequential — takes 3x the time
async function loadPageDataSlow() {
    const user     = await fetch("/api/user").then(r => r.json());
    const posts    = await fetch("/api/posts").then(r => r.json());
    const comments = await fetch("/api/comments").then(r => r.json());
    // Total: ~3s if each takes 1s
}

// ✅ Parallel — all fire together
async function loadPageDataFast() {
    const [user, posts, comments] = await Promise.all([
        fetch("/api/user").then(r => r.json()),
        fetch("/api/posts").then(r => r.json()),
        fetch("/api/comments").then(r => r.json())
    ]);
    // Total: ~1s — all happen simultaneously
    console.log(user.name, posts.length, comments.length);
}
```

---

## 🔁 Concept Recap — Quick Cheatsheet

```
ASYNC FUNCTIONS
  async function fn() { return "x" }
  → always returns Promise { "x" }
  → errors → Promise rejects automatically
  → no return → Promise { undefined }

AWAIT
  only inside async functions
  pauses THAT function — not the whole program
  const result = await somePromise;
  await on plain value → resolves immediately (no-op)

EXECUTION ORDER
  no await  → all async calls fire simultaneously (parallel)
  with await → each waits for previous (sequential)
  code AFTER async function call → runs immediately (async fn doesn't block)

ERROR HANDLING
  try { await risky() } catch(err) { handle }
  ONE try/catch covers ALL awaited calls inside it
  code after try/catch ALWAYS runs (add return in catch to stop)
  fetch does NOT reject on 404/500 — check res.ok manually!

JSON
  JSON.parse(string)     → string  → JS object  (receiving from API)
  JSON.stringify(object) → object  → string     (sending to API)
  res.json()             → shortcut for JSON.parse on fetch response body
  Functions and undefined are silently dropped by stringify

FETCH
  fetch(url)             → Promise<Response>    ← await #1
  res.json()             → Promise<Object>      ← await #2
  res.ok                 → true if status 200-299
  fetch only rejects on  → network failure, not 4xx/5xx
  GET(default), POST, PUT, PATCH, DELETE via { method: "..." }
  Send JSON body: body: JSON.stringify(data) + Content-Type header

PARALLEL vs SEQUENTIAL
  Sequential → await each one separately (use when order matters)
  Parallel   → Promise.all([...]) (use when independent — faster)
```

---

## 🎯 Must-Know Interview Questions from This File

1. **What does `async` do to a function's return value?**
2. **What happens if an `async` function has no `return` statement?**
3. **What does `await` pause? Does it block the entire JS program?**
4. **What is the difference between calling a Promise-returning function with and without `await`?**
5. **Why does `fetch` need two `await`s?**
6. **Does `fetch` reject on a 404 or 500 response? How do you handle it correctly?**
7. **What is the difference between `JSON.parse` and `JSON.stringify`?**
8. **What happens when you `JSON.stringify` an object containing a function?**
9. **What is the difference between sequential `await` calls and `Promise.all`?**
10. **Rewrite this Promise chain using `async/await`:**
    ```js
    fetch(url)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
    ```

### Answer to Q10

```js
async function getData() {
    try {
        const res  = await fetch(url);
        const data = await res.json();
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}
```

---

> 💡 **Tip for Product-Based Interviews:** `async/await` + `fetch` is the **single most tested combo** in frontend interviews at product companies. Every real feature — login, search, cart, checkout, notifications — involves fetching data. The two things that trip people up: (1) forgetting that `fetch` doesn't throw on 404/500, and (2) not knowing when to use `Promise.all` for parallel calls instead of sequential `await`s. Knowing that sequential takes N×time but parallel takes 1×time is a performance optimization point that interviewers at Swiggy and Flipkart specifically look for. You have now covered the complete async journey: Callbacks → Promises → async/await. That is the arc every senior JS developer needs to explain fluently.
