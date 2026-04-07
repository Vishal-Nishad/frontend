// 👉 1. DOM introduction
// DOM (Document Object Model), The DOM represents a document with a logical tree.
// It allows us to manipulate/change webpage content(HTML elements)


// 👉 2. Selecting Element
// a. 🎯 getElementById
// Returns the Element as an Object or null(if not found)
let imageObject = document.getElementById("mainImg")  // it give us the full object
console.dir(imageObject)

// 👉 
// b. getElementByClassName
// Returns the elements as an HTML Collection or 
// empty collection (if not found)
let imageObjec = document.getElementsByClassName("oldImg")// it give us the full object
console.dir(imageObjec)

// 👉 
// b. getElementByTagName
// Returns the elements as an HTML Collection or 
// empty collection (if not found)
let tabObj = document.getElementsByTagName("p")  // it give us the full object
console.log(imageObject)


// 👉 8. Query Selectors
// query selectors is normally used more than normal selector like by id,class,tag
//
document.querySelector("h1")//selects first p element
document.querySelector("#description")// selects first element with id = myId
document.querySelector(".oldImg")// selects first element with class = myclass

document.querySelector("div a");

// querySelectorAll give all elements
document.querySelectorAll("p") // select all p elements
