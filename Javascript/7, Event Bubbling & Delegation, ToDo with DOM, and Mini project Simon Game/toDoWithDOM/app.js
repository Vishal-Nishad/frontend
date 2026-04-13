let btn = document.querySelector("button");
let ul = document.querySelector("ul");
let inp = document.querySelector("input")

btn.addEventListener("click",function (){
    let item = document.createElement("li");
    item.innerText = inp.value;

    let delBtn = document.createElement("button");
    delBtn.innerText = "delete"
    delBtn.classList.add("delete")
    item.appendChild(delBtn)
    ul.appendChild(item)
    console.log(inp.value)
    inp.value = ""
})

// let delBtns = document.querySelectorAll(".delete")
// for(delbtn of delBtns){
//     delbtn.addEventListener("click", function(){
//         console.log("task deleted")
//         let par = this.parentElement;
//         console.log(par)
//         par.remove(); // this remove only apply to existing elements
//         // means if button added by createElement then this will not work
//         // that newly created task/li
//     });
// }


// 👉 3. Event Delegation
// event delegation -> if we want to apply any event listener to newly created element
// using document.createElement(""), then we use event delegation

ul.addEventListener("click", function (event){
    if(event.target.nodeName == "BUTTON"){ // target.nodeName will return the exact element on which we are clicking 
        // as our delete button is inside li and li is inside ul
        let listItem = event.target.parentElement;
        listItem.remove();
        console.log("deleted")
    }
})