# 5. Automatic object literals keys to string conversion in js 
```js
const example = {
    1:"a",
    2:"b",
    null:"c",
    true:"d",
    undefined:"e"
} 
```

* In normal JS objects, keys are stored as **strings**
* So:

  * `example[1]` → `example["1"]`
  * `example[null]` → `example["null"]`
  * `example[true]` → `example["true"]`

### Rule

```js id="mt18bh"
obj[value]
```

* JS first evaluates `value`
* then converts it to a **property key** (usually string)

#### **Super clean rule:-**
- If you write: `obj[something]`
- **ask yourself**: Is something a value/expression or a string literal? like null,true,undefined or int values

- **If it is**: 1, true, null, undefined → valid values → converted to strings
- **but if it is**: username, content, undefin → variable lookup happens first

* **If variable doesn't exist → ReferenceError**

### Trap

```js id="9df8q8"
obj[username]   // variable lookup first
obj["username"] // direct string key
```

* If `username` variable does not exist → `ReferenceError`

### Dot notation
`obj.username`
* Use when key name is fixed and valid identifier.

