// 👉 1. JS Call Stack

function hello(){
    console.log("hello i am vishal")
}

function demo(){
    hello();
}

// demo();

// 👉 2. Visualizing the Call Stack
function one(){
    return 1;
}
function two(){
    return one() + one();
}

function three(){
    let ans = two() + one();
    console.log(ans)
}
// three();  

// 👉 3. breakpoints in JS dev tool sources 


// 👉 4. JS in Single Threaded
setTimeout(()=>{
    console.log("apna college");
},2000);
setTimeout(()=>{
    console.log("i am vishal");
},2000);
console.log("hello")



// 👉 5. Callback hell
let h1 = document.querySelector("h1")

// function changeColor(color,delay){
//     setTimeout(() => {
//         h1.style.color = color;
//     }, delay);
// }
// changeColor("red",1000);
// changeColor("blue",2000);
// changeColor("green",3000);

// above code is normal call
// below is example of callback hell that is callbacks nesting
function changeColor(color,delay,nextColorChange){
    setTimeout(() => {
        h1.style.color = color;
        if(nextColorChange){
            nextColorChange();
        }
    }, delay);
}

changeColor("red",1000,()=>{
    changeColor("green",1000,()=>{
        changeColor("blue",1000,()=>{
            changeColor("brown",1000,()=>{
                changeColor("orange",1000)
            })
        })
    })
})