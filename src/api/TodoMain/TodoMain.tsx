import React from 'react';
import { Todo } from '../../types/Todo';

type Prop = {
  todos: Todo[];
  toggleTodo: (id: number) => void;
};

export const TodoMain: React.FC<Prop> = ({ todos, toggleTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This todo is an active todo  className="todo" */}
      {todos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={todo.completed ? 'todo completed' : 'todo'}
        >
          <label className="todo__status-label" >
            <input
              data-cy="TodoStatus"
              type="checkbox"
              checked={todo.completed}
              className="todo__status"
              onClick={() => toggleTodo(todo.id)}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
