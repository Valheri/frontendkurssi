import { useState } from "react";
import "./TodoList.css";

type Todo = {
  description: string;
  date: string;
}

function TodoList() {
  const [todo, setTodo] = useState<Todo>({ description: '', date: '' });
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = () => {
    setTodos([...todos, todo]);
    setTodo({
      description: '',
      date: ''
    });
  };
// näytti keltaista ja ChatGPT osasi antaa vastauksen (todo vaihdetaan _ ).
// Tämä ei ole pakollista, mutta se on hyvä käytäntö, koska se osoittaa, että et käytä todoa.
  const deleteTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <>
      <h1 className="todo-title">Todo List</h1>
      <input
        className="todo-input"
        placeholder="Description"
        onChange={event => setTodo({ ...todo, description: event.target.value })}
        value={todo.description}
      />
      <input
        className="todo-input"
        placeholder="Date"
        onChange={event => setTodo({ ...todo, date: event.target.value })}
        value={todo.date}
      />
      <button className="todo-button" onClick={addTodo}>Add</button>
      <table className="todo-table">
        <thead>
          <tr>
            <td>Description</td>
            <td>Date</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, index) => (
            <tr key={index}>
              <td>{todo.description}</td>
              <td>{todo.date}</td>
              <td>
                <button className="todo-delete-button" onClick={() => deleteTodo(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default TodoList;