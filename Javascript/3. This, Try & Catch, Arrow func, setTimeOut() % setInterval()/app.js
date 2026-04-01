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