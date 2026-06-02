import { useState } from "react";
export default function Form(){
    let [fullName, setFullName] = useState("vishal");

    let handleNameChange = ()=>{
        console.log(event.target.value);
        setFullName(event.target.value);
    }
    return (
        <form >
            <input placeholder="enter full name" type="text" value={fullName} 
            onChange={handleNameChange}/>
            <button>Submit</button>
        </form>
    )
}