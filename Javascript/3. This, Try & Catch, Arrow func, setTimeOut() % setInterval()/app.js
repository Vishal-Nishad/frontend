// 1. This keyword
// This keyword refers to an object that is executing the current piece of code.
const student = {
    name:"vishal",
    age:23,
    eng:95,
    math:93,
    phy:40,
    getAvg(){
        let avg = (this.eng + this.math + this.phy)/3;
        console.log(avg);
        console.log(`${this.name} got avg marks is: ${avg}`)
    }
}

student.getAvg()

function thisprint(){
    console.log(this);
}
thisprint()

// 2. Try and Catch
try{
    console.log(a)
}catch{
    console.log("a is not defined")
}

// try{
//     console.log(a)
// }catch(err){
//     console.log("a is not defined")
//     console.log(err)
// }

// 3. Arrow function
// const func_name = (arg1,....argn) =>{function defintion}

const greet = () => {
    console.log("hello vishal")
}
greet()

const sum = (a,b) =>{
    console.log(a+b)
}
sum(5,6)

// 4. Arrow function implicit return
const prod = (a,b)=>(a*b)
console.log(prod(5,5))


//5. setTimeout function
// setTimeout(func- callback,timeout in ms)

console.log("hi there")
setTimeout(()=>{
    console.log("vishal learning")
},4000);
console.log("finally printed")

// 6. setInterval function