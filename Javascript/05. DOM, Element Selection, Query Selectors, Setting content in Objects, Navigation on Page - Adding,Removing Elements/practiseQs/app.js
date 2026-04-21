// Add the following elements to the container using only 
// Javascript and the DOM methods

// Q 1. a <p> with red text that says "Hey i'm red"

let para1 = document.createElement("p");
para1.innerText = "Hey i'm red";
document.querySelector("body").append(para1)

para1.classList.add("red");


// Q 2. an <h3> with blue text that says "i'm a blue h3"

let head3 = document.createElement("h3");

head3.innerText = "I'm a blue h3"

document.querySelector("body").append(head3)

head3.classList.add("blue");



// Q.3 a <div> with a black border and pink background color with
// the following elements inside of it:

// -> another <h1> that says "i'm in a div"
// -> a <p> that says "ME TOO!"

let div = document.createElement("div");
let h1 = document.createElement("h1");
let para2 = document.createElement("p");

h1.innerText = "i'm in a div";
para2.innerText = "ME TOO";

div.append(h1);
div.append(para2);
div.classList.add("box")

document.querySelector("body").prepend(div);