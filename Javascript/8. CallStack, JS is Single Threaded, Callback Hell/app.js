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