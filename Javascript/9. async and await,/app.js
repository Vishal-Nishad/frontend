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