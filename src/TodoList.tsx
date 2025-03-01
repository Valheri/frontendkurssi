import { useState } from "react";
import "./TodoList.css";
import TodoTable from "./TodoTable";

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
      <TodoTable todos={todos} deleteTodo={deleteTodo} />
    </>
  );
}

export default TodoList;