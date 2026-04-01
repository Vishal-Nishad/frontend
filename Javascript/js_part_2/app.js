function print1to5(){
    for(let i = 1;i<=5;i++){
        console.log(i);
    }
}
// print1to5();

function isAdult(n){
    if(n>=18){
        console.log("Adult")
    }else{
        console.log("Not Adult")
    }
}
// isAdult(80);

// 3. Qs to print or generate random dice number
function diceNumber(){
    console.log(Math.floor(Math.random() * 6) + 1)
}
// diceNumber();
// diceNumber();
// diceNumber();
// diceNumber();
// diceNumber();
// diceNumber();

// 5. write function to return average of 3 number
function average3(a,b,c){
    console.log((a+b+c)/3)
}
// average3(4,6,5)

//6 function to print a multiplication table of any number
function printTable(n){
    for(let i= 1;i<=10;i++){
        console.log(`${n} * ${i} = ${n*i}`)
    }
}
// printTable(5);


// 8. return sum of number from 1 to n
function naturalSum(n){
    sum = 0
    for(let i=1;i<=n;i++){
        sum = sum + i;
        // console.log(sum)
    }
    return sum
}
naturalSum(5)
console.log(naturalSum(5))

// 9. function which return concatenation of all strings in an array
function concatStrArr(ar){
    let result = "";
    for(let i= 0;i<ar.length;i++){
        result += ar[i];
    }
    return result;
}
a = ["hello","i","am","vishal"]
console.log(concatStrArr(a));


// 15. Higher order functions
// takes one or multiple functions as arguments

let greet = function(){  // this is called function expression, we define function by variable
    console.log("hello") // variable name, and also call like greet()
}

function multipleGreet(func,count){
    for(let i = 1;i <= count;i++){
        func();
    }
}
multipleGreet(greet,200) // always pass definition, don't execute like greet()
multipleGreet(function(){console.log("vishal")},10)

// 16. higher order functions return, example taken factory function which return functions