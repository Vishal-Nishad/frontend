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
