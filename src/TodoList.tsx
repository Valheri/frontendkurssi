import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useRef, useState } from "react";
import "./TodoList.css";

ModuleRegistry.registerModules([AllCommunityModule]);

type Todo = {
    description: string;
    priority: string;
    date: string;
};

type TodoListProps = {
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

function TodoList({ todos, setTodos }: TodoListProps) {
    const [todo, setTodo] = useState<Todo>({ description: "", priority: "", date: "" });
    const gridRef = useRef<AgGridReact<Todo>>(null);

    const [columnDefs] = useState<ColDef<Todo>[]>([
        { field: "description", sortable: false, filter: true, flex: 2 },
        {
            field: "priority",
            filter: true,
            flex: 1,
            cellStyle: (params) => {
                if (params.value === "High") {
                    return { color: "red" };
                } else if (params.value === "Medium") {
                    return { color: "orange" };
                } else if (params.value === "Low") {
                    return { color: "green" };
                } else {
                    return { color: "black" };
                }
            },
        },
        { field: "date", filter: true, flex: 1 },
    ]);

    const addTodo = () => {
        if (!todo.description || !todo.priority || !todo.date) {
            alert("All fields are mandatory!");
            return;
        }

        setTodos([...todos, todo]);
        setTodo({
            description: "",
            priority: "",
            date: "",
        });
    };

    const handleDelete = () => {
        if (gridRef.current?.api.getSelectedNodes().length) {
            setTodos(
                todos.filter(
                    (_, index) => index !== Number(gridRef.current?.api.getSelectedNodes()[0].id)
                )
            );
        } else {
            alert("Select a row first!");
        }
    };

    return (
        <>
            <h1 className="todo-title">Todo List</h1>
            <input
                className="todo-input"
                placeholder="Description"
                onChange={(event) => setTodo({ ...todo, description: event.target.value })}
                value={todo.description}
            />
            <select
                title="Priority"
                className="todo-input"
                onChange={(e) => setTodo({ ...todo, priority: e.target.value })}
                value={todo.priority}
            >
                <option value="" disabled>
                    Select Priority
                </option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>
            <input
                className="todo-input"
                placeholder="Date"
                type="date"
                onChange={(e) => setTodo({ ...todo, date: e.target.value })}
                value={todo.date}
            />
            <button className="todo-button" onClick={addTodo}>
                Add
            </button>
            <button className="todo-button" onClick={handleDelete}>
                Delete
            </button>
            <div style={{ width: "auto", height: 500 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={todos}
                    columnDefs={columnDefs}
                    rowSelection="single"
                    animateRows={true}
                />
            </div>
        </>
    );
}

export default TodoList;