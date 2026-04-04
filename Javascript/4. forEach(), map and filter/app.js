// 01. forEach 
// arr.forEach(some function definition or name);
ar = [1,2,3,4];
let print = function(el){
    console.log(el)
}

ar.forEach(print)

let st = [
    {
    name:"vishal",
    marks:100
    },
    {
    name:"hela",
    marks:98
    },
    {
    name:"reva",
    marks:67
    }
]   

st.forEach((student)=>{
    console.log(student.marks)
})


//2. Map and filter function
// let newArr = arr.map(some function or name)
let numarr = [1,2,3,4]
let doublt = numarr.map((x)=>{return x*2})
console.log(doublt)

let gpa = st.map((el)=>{
    return el.marks/10;
})
console.log(gpa)

// filter function
let num = [3,2,4,5,2,4,6,7,9,100]
let evenNum = num.filter((x)=>{
    return x%2==0;
})
console.log(evenNum)

// 3. Every & Sum function
// Every -> returns true if every element of array gives true for some function.
// Else returns false

let n = [2,4]
let m = [1,2,3]
let res_n = n.every((i)=>(i%2==0));
let res_m = m.every((i)=>{return i%2==0});
console.log(res_n,res_m)