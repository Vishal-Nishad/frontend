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



//👉 9. Setting content in objects
// innerText -> Shows the visible text contained in a Node(which actually appear on webpage/Screen)

// textContent -> Shows all the full text

// innerHTML -> Shows the full markup


// 👉 10. Manipulating Attributes
// obj.getAttribute(attr)     // getter
// obj.setAttribute(attr,val) // setter


// 👉 11. Manipulating Style , although we don't use this much, as styling written in separate css block or .css file
// using style property
// obj.style
let heading = document.querySelector("h1");
heading.style.color = "purple";
heading.style.color = "green";
// heading.style.background-color // this is wrong as it support camelcase
heading.style.backgroundColor = "yellow";

// another example 
let links = document.querySelectorAll(".box a");
for(link of links){
    link.style.color= "green"
}
for(let i = 0;i<links.length;i++){
    links[i].style.color = "purple";
}


// 👉 12. Manipulating Style
// using classList
// obj.classList

// classList.add()   to add new classes
// classList.remove() to remove classes
// classList.contains() to check if class exist
// classList.toggle() to toggle between add and remove, it deletes if already exist and add if not exists

let heading = document.querySelector("h1");
heading.classList;
heading.classList.add("abc")



// 👉 13. Navigation on Page
// parentElement      // there is only single parent element always
// children
// previousElementSibling/nextElementSibling


let h4 = document.querySelector("h1");
h4.parentElement
h4.children

let box = document.querySelector(".box");
box.children;  
box.childElementCount;

let ul = document.querySelector("ul");
ul.parentElement; // give the parent element, as it always remain single
ul.childElementCount; // give the count of total children
ul.children; // output be like HTMLCollection(3) [li,li,li]

ul.children[0]
ul.children[2]

ul.children[2].previousElementSibling;
ul.children[1].nextElementSibling;