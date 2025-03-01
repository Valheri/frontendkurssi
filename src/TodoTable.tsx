import "./TodoList.css";

type Todo = {
    description: string;
    date: string;
};

type TodoTableProps = {
    todos: Todo[];
    deleteTodo: (index: number) => void;
};

function TodoTable({ todos, deleteTodo }: TodoTableProps) {
    return (
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
    );
}

export default TodoTable;
