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



// 👉 3. await keyword handling errors, in async/await
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

async function demoChangeColor() {
    try{
        await changeColor("red",1000);
        await changeColor("green",1000);
        await changeColor("orange",1000);
        await changeColor("blue",1000);
    }catch(err){
        console.log("error caught:");
        console.log(err)
    }
    let a = 5;
    console.log(a);
    console.log("new number")
}
demoChangeColor()


// 👉 7. Accessing JSON data
// JSON-> JavaScript Object Notation

// JSON.parse(data) method  -> to parse a string data into a JS object
// JSON.stringify(json) method -> to parse a JS object data into JSON

let jsonRes = '{"fact":"hello i am vishal this is json parse", "length":78}';
let validRes = JSON.parse(jsonRes);
console.log(validRes.fact) // if we don't do parse then it will throw error as it is in str


let student = {
    name:"vishal",
    marks:100,
};
console.log(JSON.stringify(student))


// 👉 15. making api call using async/await

let url = "https://catfact.ninja/fact";

async function getFacts() {
    try{
        let res = await fetch(url);
        let data = await res.json();
        console.log("full data json: ",data)
        console.log("data.fact: ", data.fact);

        let res2 = await fetch(url);
        let data2 = await res2.json();
        console.log("full data json: ",data2)
        console.log("data.fact: ", data2.fact);
    }catch(e){
        console.log("error - ",e);
    }
    console.log("bye");
}

getFacts()

