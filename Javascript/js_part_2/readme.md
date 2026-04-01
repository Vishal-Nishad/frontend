# `let` vs `const` vs `var`

## 1) Definition

* **`const`** → cannot be reassigned (fixed binding)
* **`let`** → can be reassigned
* **`var`** → old keyword, function-scoped (not block-scoped)

## 2) Example

```js
const a = 10;
a = 20; // ❌ error

let b = 10;
b = 20; // ✅ works

if (true) {
    var c = 10;
}
console.log(c); // ✅ works (leaks outside block)
```

---

## 3) Rule (most important)

* Default → **use `const`**
* If value changes → **use `let`**
* Avoid → **`var`**

👉 Shortcut:

> “Will this value change?”

* NO → `const`
* YES → `let`

---

## 4) Interview traps

* `const` does **NOT** make object immutable

```js
const obj = { a: 1 };
obj.a = 2; // ✅ works
```

* `var` ignores block scope

```js
if (true) {
    var x = 10;
}
console.log(x); // 10
```

* `var` can be redeclared

```js
var x = 1;
var x = 2; // ✅ allowed (dangerous)
```

---

## 5) Final mental model (best explanation)

* **`const` → value should not be reassigned**
* **`let` → value will change over time**
* **`var` → legacy, avoid in modern JS**

Or even simpler:

* **`const` = stable value**
* **`let` = changing value**
* **`var` = outdated behavior**



# **Block Scope vs Lexical Scope**

## **1) Definition**

### **Block Scope**

A variable declared with **`let` / `const`** exists only inside the nearest `{}` block where it is created.

### **Lexical Scope**

A function can access variables from the place **where it was written (defined)**, not from where it is called.

## **2) Example**

### **Block Scope**

```js id="xvzcgt"
if (true) {
    let a = 10;
}
console.log(a); // ❌ ReferenceError
```

### **Lexical Scope**

```js id="w78b9c"
let x = 10;

function test() {
    console.log(x);
}

test(); // ✅ 10
```

Why?
Because `test()` was written where `x` is available.

---

## **3) Rule**

### **Block Scope Rule**

> `let` / `const` stay inside `{}`

### **Lexical Scope Rule**

> Function looks **outward** to find variables

JS searches like this:

```id="t6f0y0"
current scope → outer scope → global scope
```

---

## **4) Interview Trap**

### **Trap 1 — `var` is NOT block scoped**

```js id="jlwmgf"
if (true) {
    var a = 10;
}
console.log(a); // ✅ 10
```

### **Trap 2 — Outer cannot access inner**

```js id="cv1ym8"
function outer() {
    let secret = "hi";
}
console.log(secret); // ❌ error
```

* 👉 Inside can access outside
* 👉 Outside cannot access inside

---

## **5) Final Mental Model (best interview answer)**

* **Block scope** decides **where a variable lives**
* **Lexical scope** decides **how a function finds variables**

Or even simpler:

* **Block scope = variable stays inside its `{}` room**
* **Lexical scope = function can see variables from rooms around where it was created**



## 6) Interview-level one-line answer

## Block Scope means:

> A variable declared with `let` or `const` is only accessible inside the `{}` block where it was declared.

---

## -) Real example with `if`

```js id="r2vsyg"
if (true) {
    let msg = "hello";
    console.log(msg); // works
}

console.log(msg); // ReferenceError
```

Why?

Because `msg` only exists inside the `if` block.

---

## -) Real example with `for`

```js id="s0s29d"
for (let i = 0; i < 3; i++) {
    console.log(i); // works
}

console.log(i); // ReferenceError
```

Why?

Because `i` is block scoped to the `for` loop.

## 7) Best combined example

```js id="q0op5j"
let globalVar = "global";

function outer() {
    let outerVar = "outer";

    if (true) {
        let blockVar = "block";

        function inner() {
            console.log(globalVar); // works
            console.log(outerVar);  // works
            console.log(blockVar);  // works
        }

        inner();
    }

    // console.log(blockVar); // ReferenceError
}

outer();
```

Now understand this carefully:

---

## Why does `inner()` access `blockVar`?

Because of **lexical scope**.

`inner()` was written inside the block where `blockVar` exists.

So it can access it.

---

## Why does this fail?

```js id="8v64ul"
console.log(blockVar);
```

Because of **block scope**.

`blockVar` only exists inside that `if` block.

---

## This is the exact connection

## Block scope defines where variables live

## Lexical scope defines how functions capture/access them

That is the clean relationship.

---

## 8) Most common interview trap

## Trap:

```js id="8s9a8g"
if (true) {
    let a = 10;
    var b = 20;
}

console.log(a); // ?
console.log(b); // ?
```

Answer:

```id="m2j24w"
console.log(a); // ReferenceError
console.log(b); // 20
```

Why?

* `a` → block scoped
* `b` → function scoped

---

## 9) Another interview trap

```js id="2a80qc"
let x = 1;

function outer() {
    let x = 2;

    function inner() {
        console.log(x);
    }

    inner();
}

outer();
```

Output?

```id="l4trfx"
2
```

Why not `1`?

Because of **lexical scope**.

`inner()` is written inside `outer()`, so it captures `outer`’s `x`.

---

## Super clean rule

## Function uses nearest available variable in lexical chain

JS looks upward and stops at the first match.

---

## Example

```js id="ykh6mh"
let x = "global";

function outer() {
    let x = "outer";

    function inner() {
        let x = "inner";
        console.log(x);
    }

    inner();
}

outer();
```

Output:

```id="8v47uv"
inner
```

Because JS finds nearest `x` first.

This is called **shadowing**.

---

## 10) Shadowing

## Shadowing = inner variable hides outer variable

Example:

```js id="2z6z4m"
let user = "global";

function test() {
    let user = "local";
    console.log(user);
}

test();
```

Output:

```id="otvxbk"
local
```

Why?

Because local `user` shadows global `user`.

---

## Rule

When JS looks for variable:

```js id="8z2tqz"
console.log(user)
```

it always uses the **nearest matching variable**.