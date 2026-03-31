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
