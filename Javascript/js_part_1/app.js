const student = {
    name: "vishal",
    age:23,
    marks:94.5
};

let student2 = ["vishal",23,94.5];

const item = {
    price: 100.99,
    discount:50,
    colors:["red","pink"]
};

//4
const post = {
    username: "@vishal123",
    content: "This is my @firstpost",
    likes:150,
    reposts:5,
    tags:["@first","newjoined"]
}

// 5. 
// js convert objects literal keys into string automatically

const example = {
    1:"a",
    2:"b",
    null:"c",
    true:"d",
    undefined:"e"
}

// 6. 
student["name"] = "nishad"
student["gender"] = "male"

student["marks"] = [4,5,2]
console.log(student)

// to delete a key
delete student.marks;
console.log(student)


// 7. object of objects

const classInfo = {
    vishal:{
        grade:"A+",
        city:"delhi"
    },
    ravi:{
        grade:"B",
        city:"mumbai"
    },
    karan:{
        grade:"C",
        city:"Lucknow"
    }
}
console.log()
console.log(classInfo)
classInfo["vishal"]["city"] = "gurgaon"
console.log(classInfo)
console.log(classInfo.vishal.grade)

//8. Array of objects
const classInfoArr = [
    {
        name:"vishal",
        grade:"A",
        city:"delhi"
    },
    {
        name:"deepak",
        grade:"B",
        city:"Patna"
    }
]
classInfoArr[0]["gender"] = "male"
console.log(classInfoArr)
console.log(classInfoArr[0]["name"])

//9. Math object
console.log(Math.pow(2,3))
console.log(Math.floor(5.54444))
console.log(Math.abs(-12.3))
console.log(Math.random()) // generate number 0 <n<1

// 10. Random integers
let num = Math.random()
num = Math.floor(num * 100)
console.log(num+1)

// 11. question- generate a random number from any given n int
console.log(Math.floor(Math.random() * 5) + 20)

// assignment question, printing dice 1-6 random number
console.log(Math.floor(Math.random()*6)+1)