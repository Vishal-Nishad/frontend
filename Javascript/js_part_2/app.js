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
        console.log(sum)
    }
    return sum
}
naturalSum(5)
// console.log(naturalSum(5))