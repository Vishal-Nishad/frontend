// 👉 1. DOM Events
// -> onclick (when an element is clicked)
// -> onmouseenter(when mouse enters an element)

let btns = document.querySelectorAll("button")
// console.dir(btn)
for(btn of btns){
    btn.onclick = sayHello;   // here if write like this sayHello() then it instantly start
    // executing whenever this page gets opened that's why we write sayHello and on 
    // onclick it gets executed
    btn.onmouseenter = function(){
        console.log("you are hovering over button")
    }
    console.dir(btn)
}

// btn.onclick = function(){
//     alert("button was clicked")
// }

function sayHello(){
    alert("hello!");
}

btn.onclick = sayHello;