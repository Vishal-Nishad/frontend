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
console.log(doublt,"map") //[2, 4, 6, 8]

let gpa = st.map((el)=>{
    return el.marks/10; 
})
console.log(gpa) //[10, 9.8, 6.7]

// filter function
let num = [3,2,4,5,2,4,6,7,9,100]
let evenNum = num.filter((x)=>{
    return x%2==0;
})
console.log(evenNum) //[2, 4, 2, 4, 6, 100]

// 3. Every & Sum function
// Every -> returns true if every element of array gives true for some function.
// Else returns false

let n = [2,4]
let m = [1,2,3]
let res_n = n.every((i)=>(i%2==0));
let res_m = m.every((i)=>{return i%2==0});
console.log(res_n,res_m,"every method")

//4. Reduce method -> Reduces the array to a sigle value
// arr.reduce(reducer function with exactly 2 variables for(accumulator,element));

let finalVal = m.reduce((res,el)=>{
    console.log(res,el)
    return res + el
});
console.log(finalVal,"reduce method")

// 5. Finding maximum using reduce method
let val = [4,56,3,4,23]
let maxVal = (ar)=>{
    let res = 0
    for (let i = 0; i<val.length;i++){
        if (ar[i] > res){
            res = ar[i]
        }
    }
    return res
}
console.log(maxVal(val),"maxVal")
// now using reduce method
let ans = val.reduce((max,el)=>{
    if(max>el){
        return max
    }else{
        return el
    }
});
console.log(ans,"maximum using reduce method")

