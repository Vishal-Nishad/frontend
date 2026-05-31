function handleClick(){
    console.log("hello!");
}

function handleMouseOver(){
    console.log("bye!");
}

function doubleClickMe(){
    console.log("double clicked")
}

export default function Button(){
    return (
        <div>
            <button onClick={handleClick}>Click me!</button>
            <p onMouseOver={handleMouseOver}>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Voluptatibus deserunt vitae ducimus itaque possimus. 
                Id expedita vel similique doloremque nihil assumenda 
                perspiciatis impedit dolorem quos nam necessitatibus, 
                ipsa soluta vero.
            </p>
            <button onDoubleClick={doubleClickMe}>Double Click me!</button>
        </div>
    )
}