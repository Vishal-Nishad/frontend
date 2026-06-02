// 👉 1. Events in React
// Handling click events
import Button from './Button.jsx'

// 👉 3. Events in React
import Form from './Form.jsx';

// 👉👉 4. State in React: The state is a built-in React object that is used to 
// contain data or information about the component. A component's state can change 
// over time; whenever it changes , the component re-renders.

// 👉👉 5. Hooks: Hooks were a new addition in React 16.8. They let you use
// state and other React features without writing a class


// 👉👉 6. useState(): useState is a React Hook that lets you add a state variable
// to your component.
// const [state, setState] = useState(initialState);
// useState returns an array with exactly two values:
// 1. the current state. During the first render, it will match the initialState
// you have passed.
// 2. The set function that lets you update the state to a different value and 
// trigger a re-render

import Counter from './Counter.jsx';

// 👉👉 8. Closure in JS: A closure is a feature in JS where an inner function
// has access to the outer(enclosing) function's variables. * as in JS, once a
// function completes its execution, any variables that were defined inside the
// function scope gets deleted.
// so in closure we are solving this above said problem
/* example of closure: 
function outer(){
    let b = 10;
    function inner(){
        let a = 20;
        console.log(a+b);
    }
    return inner;
    }
let inner = outer();
inner()  // this will work perfectly fine, and give o/p = 30
*/

// 👉👉 9. Re-render: How does it work

// 👉👉 10. Callback in setState Function i.e updater function: how to change state
// when it depends on the current value

function App(){
    return (
        <>
            <Button/>
            <Form/>
            <Counter/>
        </>
    );
}

export default App;