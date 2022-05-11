import { useState, useEffect } from 'react';
import { EditTodo } from './EditTodo';

export const ListTodos = () => {
  const [todos, setTodos] = useState([]);

  const getTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/todos');
      const jsonData = await response.json();

      setTodos(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: 'DELETE',
    });

    setTodos(todos.filter((todo) => todo.todo_id !== id));
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <>
      <table className="table mt-5 text-white w-75 mx-auto text-center">
        <thead>
          <tr>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => {
            return (
              <tr key={todo.todo_id}>
                <td>{todo.description}</td>
                <td>
                  <EditTodo todo={todo} setTodo={setTodos} />
                </td>
                <td>
                  <button
                    onClick={() => deleteTodo(todo.todo_id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
          {/*
          <tr>
            <td>John</td>
            <td>Doe</td>
            <td>john@example.com</td>
          </tr>
           */}
        </tbody>
      </table>
    </>
  );
};
