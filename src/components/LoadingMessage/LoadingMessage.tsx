import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoMain } from '../../api/TodoMain';
import { addPost, getTodos, updateTodo } from '../../api/todos';

export const LoadindMessage: React.FC = () => {
  const inputFocus = useRef<HTMLInputElement>(null);
  const [titleMessage, setTitleMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filtered, setFiltered] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState<
    'all' | 'active' | 'completed'
  >('all');

  function loadTodos() {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }

  useEffect(loadTodos, []);

  function toggleTodo(todoId: number) {
    setErrorMessage('');

    updateTodo(todoId).catch(() => setErrorMessage('Unable to update todo'));
  }

  function addTodo({ title, completed }: Todo) {
    setErrorMessage('');

    return addPost({ title, completed })
      .then(newTodo => {
        setTodos(currentTodo => [...currentTodo, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      });
  }

  useEffect(() => {
    inputFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 4000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleMessage(event.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!titleMessage.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    addTodo({ title: titleMessage, completed: false });
    setTitleMessage('');
  };

  useEffect(() => {
    let result = [...todos];

    if (currentFilter === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
      result = result.filter(todo => todo.completed);
    }

    setFiltered(result);
  }, [todos, currentFilter]);

  const handleFilterChange = (filter: 'all' | 'active' | 'completed') => {
    setCurrentFilter(filter);
  };

  return (
    <>
      <div className="todoapp__content">
        {/* <TodoForm onSubmit={addTodo} todos={todos} /> */}
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              ref={inputFocus}
              placeholder="What needs to be done?"
              value={titleMessage}
              onChange={handleTitleChange}
            />
          </form>
        </header>
        {todos.length > 0 && (
          <TodoMain todos={filtered} toggleTodo={toggleTodo} />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${currentFilter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => handleFilterChange('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${currentFilter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => handleFilterChange('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${currentFilter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => handleFilterChange('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
      >
        {/* DON'T use conditional rendering to hide the notification. Add the 'hidden' class to hide the message smoothly */}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        <p>{errorMessage}</p>
      </div>
    </>
  );
};
