// variabes and data types
let age = 20;
// if else
if (age<18){
    console.log("minor");
}else{
    console.log("Adult");
}
// else if
let score = 38;
if (score > 90){
    console.log("A")
}else if (score > 70){
    console.log("B")
}else if (score > 50){
    console.log("C")
}else if (score > 33){
    console.log("D")
}else{
    console.log("Fail")
}

// for loop and while loop
for(let i = 0; i<=10; i++){
    console.log(i)
}

let count = 0;
while (count<=10){
    console.log("vishal", count);
    count ++;
}

// for of loop iterating over variables
let num = [4,2,6,5,2]

for (let n of num){
    console.log(n,"hello")
}

//function
function concatenateString(str1,str2){
    return str1 + str2;
}
console.log(concatenateString("hello","vishal"))

function addNumbers(a,b){
    return a+b;
}
console.log(addNumbers(5,4));

function greet(name){
    return `hello good morning ${name}`;
}
console.log(greet("vishal"))

