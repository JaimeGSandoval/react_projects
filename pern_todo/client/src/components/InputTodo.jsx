import { useState } from 'react';

export const InputTodo = () => {
  const [description, setDescription] = useState('');

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = { description };
    try {
      const response = await fetch('http://localhost:5000/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setDescription('');

      window.location = '/';
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <h1 className="text-center mt-5">Pern Todo List</h1>

      <form className="d-flex w-50 mx-auto mt-5" onSubmit={handleSubmit}>
        <input
          className="form-control "
          onChange={handleChange}
          type="text"
          value={description}
        />
        <button className="btn btn-success">Add</button>
      </form>
    </>
  );
};
