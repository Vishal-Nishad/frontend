// 👉 1. DOM Events
// -> onclick (when an element is clicked)
// -> onmouseenter(when mouse enters an element)

let btns = document.querySelectorAll("button")
// console.dir(btn)
for(let i= 0; i<btns.length -1;i++){
    btns[i].onclick = sayHello;   // here if write like this sayHello() then it instantly start
    // executing whenever this page gets opened that's why we write sayHello and on 
    // onclick it gets executed
    btns[i].onmouseenter = function(){
        console.log("you are hovering over button")
    }
    console.dir(btns[i])
}

// btn.onclick = function(){
//     alert("button was clicked")
// }

function sayHello(){
    alert("hello!");
}

function sayName(){
    alert("how are you vishal")
}

// btn.onclick = sayHello;

// onclick only works for one time click means we can do multiple things on that single click
// that's why we use mostly event listeners for mutliple work on single click on any 
// button


// 👉 3. Event Listeners
// addEventListener
// element.addEventListener(even,callback)

let btn2 = document.querySelector("#addEventListener")
btn2.addEventListener("click",sayHello)
btn2.addEventListener("click",sayName)

let btn3 = document.querySelector("#addEventListenerDbc")
btn3.addEventListener("dblclick", function (){
    console.log("you double clicked me");
})



// 👉 5. Event Listeners for Elements
let para = document.querySelector("p")

para.addEventListener("click", function (){
    console.log("para was clicked")
})

let box = document.querySelector("div");
box.addEventListener("mouseenter",function (){
    console.log("mouse inside div")
})