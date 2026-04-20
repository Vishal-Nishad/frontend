// 👉 1. async Functions
// in prefix we async keywords to create async functions, all async functions always return 
// promise on which we can perform .then and .catch
// each promise can have one state out of three, 1. fulfilled 2. rejected 3. pending 
// and the function return value stored in promiseResult

async function greet(params) {
    return "hello world!"; // return a promise, even if a async function does not have 
    // any return then also async function return promise
}

let demo = async () => {
    return "hello from arrow function" // return a promise
}

async function asyncDemo() {
    ehllo.hell();  // in case of error, promise state is rejected and error msg will be in 
    // promiseResult  
    return "hello"
}

greet().then((result)=>{
    console.log("promise was resolved");
    console.log("promise result is: ",result)
}).catch((err)=>{
    console.log("promise was rejected with err: ",err)
})

asyncDemo().then((result)=>{
    console.log("promise was resolved");
    console.log("promise result is: ",result)
}).catch((err)=>{
    console.log("promise was rejected with err: ",err)
})

demo().then((result)=>{
    console.log("promise was resolved");
    console.log("promise result is: ",result)
}).catch((err)=>{
    console.log("promise was rejected with err: ",err)
})




// 👉 2. await keyword in async function

async function randomNum(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            let num = Math.floor(Math.random() * 100);
            console.log(num);
            resolve();
        }, 1000);
    });
}

async function demoWithoutAwait() {
    randomNum();
    randomNum();
    randomNum();// without await keyword all three random numbers get printed at same time
    console.log("hello")
}

async function demoWithAwait() {
    await randomNum();
    await randomNum();
    console.log("hello")
    randomNum();
}

demoWithoutAwait();
console.log("  hello")
demoWithAwait();


let h1 = document.querySelector("h1");

function changeColor(color,delay){
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            let num = Math.floor(Math.random()*5 + 1);
            if(num>3){
                reject("promise rejected");
            }
            h1.style.color = color;
            console.log(`color changed to ${color}`);
            resolve("color changed");  
        }, delay);
    })
}

async function demo() {
    await changeColor("red",1000);
    await changeColor("green",1000);
    await changeColor("orange",1000);
    await changeColor("blue",1000);

    let a = 5;
    console.log(a);
    console.log("new number")
}


// 👉 3. await keyword handling errors, in async/await