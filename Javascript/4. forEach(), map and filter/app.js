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
let num = [1,2,3,4]
let doublt = num.map((x)=>{console.log(x*2)})
doublt

let gpa = st.map((el)=>{
    return el.marks/10;
})
console.log(gpa)