import { useState } from "react";

type Todo = {
  description: string;
  date: string;
}

function TodoList() {
  const [todo, setTodo] = useState<Todo>({description: '', date: ''});
  const [todos, setTodos] = useState<Todo[]>([]);
  
  const addTodo = () => {
    setTodos([...todos, todo]);
    setTodo({
      description: '',
      date: ''
    });
  };

  return(
    <>
      <h1>Todo List</h1>
      <input 
        placeholder="Description" 
        onChange={event => setTodo({...todo, description: event.target.value})} 
        value={todo.description} 
      />
      <input 
        placeholder="date"
        onChange={event => setTodo({...todo, date: event.target.value})} 
        value={todo.date} 
      />
      <button onClick={addTodo}>Add</button>
      <table>
        <thead>
          <tr>
            <td>Description</td>
            <td>Date</td>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, index) => (
            <tr key={index}>
              <td>{todo.description}</td>
              <td>{todo.date}</td>
            </tr>
          ))}
        </tbody>
      </table>   
    </>
  );
}

export default TodoList;