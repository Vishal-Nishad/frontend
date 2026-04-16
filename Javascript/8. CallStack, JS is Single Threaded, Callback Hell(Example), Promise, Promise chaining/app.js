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
// setTimeout(()=>{
//     console.log("apna college");
// },2000);
// setTimeout(()=>{
//     console.log("i am vishal");
// },2000);
// console.log("hello")



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



// 👉 6. Setting up for Promises
// below is also a real prod like example of callback hell, which promises solved easily
function saveToDb(data,success,failure){
    let internetSpeed = Math.floor(Math.random() * 10 + 1);
    if(internetSpeed > 4){
        success();
    }else{
        failure();
    }
}

saveToDb("vishal",()=>{
    console.log("success: your data was saved");
    saveToDb("hello vishal", ()=>{
        console.log("success2: data2 saved");
        saveToDb("how are you",()=>{
            console.log("success3: data3 saved")
        },
        ()=>{
            console.log("failure3: weak connection")
        }    )
    }, ()=>{
        console.log("failure2: weak connection")
    })
},
()=>{
    console.log("failure: weak connection, data not saved");
}

)


// 👉 7. Refactoring above callback hell with promises
// Promises -> the promise object represents the eventual completion(or failure) of an
// asynchronous operation and its resulting value.

// Promises in JS is object having two things -> resolve and reject

function savedToDb(data){
    return new Promise((resolve,reject)=>{ // whenever a promise called these two args are by default present
        let internetSpeed = Math.floor(Math.random()*10 + 1);
        if(internetSpeed > 4){
            resolve("success: data was saved");
        }else{
            reject("failure: weak connection");
        }
    });
}
console.log("\n")

// 👉 8. as Promises is object so it has two methods .then() and .catch 
// .then for resolve/success and .catch for reject/failure

let request = savedToDb("hi vishal") // now request is that promise object which savedToDb returned

request.then(()=>{
    console.log("promise was resolved");
    console.log(request)
}).catch(()=>{
    console.log("promise was rejected")
    console.log(request)
})


// more short/compact way to write directly on async/await function means which returns promises
savedToDb("vishal").then(()=>{
    console.log("   \n") 
    console.log("\n")
    console.log("direct: promise was resolved");
    console.log(request)
}).catch(()=>{
    console.log("direct: promise was rejected")
    console.log(request)
})




// 👉 9. Promise chaining