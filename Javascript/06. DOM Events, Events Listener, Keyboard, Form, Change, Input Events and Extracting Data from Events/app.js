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



// 👉 6. This in Event Listeners
// When 'this' is used in a callback of event handler of something, it refers to that
//  something
let btn4 = document.querySelector("#thisInAddELTest")
btn4.addEventListener("click", function (){
    console.log(this)  // here this refer to same selected element object, so it will print
    // <button id="thisInAddELTest">This in addEventListener Test</button>
    this.style.backgroundColor = "red"
})

function changeColor(){
    console.log(this);
    this.style.backgroundColor = "red"
}

let ele = document.querySelectorAll(".thisTest")

for (let el of ele){
    el.addEventListener("click",changeColor);
}



// 👉 7. Keyboard Events
// 

let btn5 = document.querySelector("#keyboardEvents")

btn5.addEventListener("click",function (){
    console.log(event) /// in every addEventListener callback function () we have default
    // event as argument in it, likt function (event)
    console.log("button clicked")
})

let inp = document.querySelector("input")
// inp.addEventListener("keydown", function (event){
//     console.log("key was pressed")
//     console.log("key = ", event.key, "and code = ", event.code)
    
// });

inp.addEventListener("keydown", function (event){
    console.log("key = ", event.key, "| code = ", event.code); // ArrowUP, ArrowDown, ArrowLeft, ArrowRight
    if (event.code == "ArrowUp"){
        console.log("character moves forward");
    }else if (event.code == "ArrowDown"){
        console.log("character moves backward");
    }else if(event.code == "ArrowLeft"){
        console.log("character moves left");
    }else if (event.code == "ArrowRight"){
        console.log("character moves right");
    }
});



// 👉 8. Form Events

let form = document.querySelector("form");
form.addEventListener("submit", function (event){
    event.preventDefault();

    // frequent way of accessing elements inside form
    console.dir(form); // form.elements = special array-like DOM collection 
    // with index access + named access

    // let form = document.querySelector("form");

    // console.log(form.elements[0]);      // first input
    // console.log(form.elements.user);    // input with name="user" or id="user"
    // console.log(form.elements.length);  // total controls

    let user = this.elements[0]; // is same as form.elements[0]
    let pass = this.elements[1];

    // let user = document.querySelector("#user")
    // let pass = document.querySelector("#pass")
    console.dir(user)
    console.log(user)
    console.log(user.innerText) // here in case of input, the entered value does not store here
    console.log(user.value) // for input element, the entered value stored in value property
    alert(`Hi ${user.value}, your password is set to ${pass.value}`)
});



// 👉 10. More Events
// Change Events -> The change event occurs when the value of an element has been changed
// (only works on <input>, <textarea> and <select>elements)

// Input event -> The input event fires when the value of an <input>,<select> or 
// <textarea> element has been changed

let inp1 = document.querySelector("#inpChangeEvent")

let para1 = document.querySelector("#paraChangeEvent")
inp1.addEventListener("change",function (){
    console.log(inp1.value)
    para1.innerText = inp1.value
})