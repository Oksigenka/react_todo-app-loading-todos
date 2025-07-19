import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoMain } from '../TodoMain';
import { addPost, getTodos, updateTodo } from '../../api/todos';
import { TodoHeader } from '../TodoHeader';
import { TodoFooter } from '../TodoFooter';
import { ErrorNotification } from '../ErrorNotification';

export const TodoPage: React.FC = () => {
  const [titleMessage, setTitleMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filtered, setFiltered] = useState<Todo[]>([]);
  // eslint-disable-next-line max-len, prettier/prettier
  const [currentFilter, setCurrentFilter] = useState<'all' | 'active' | 'completed'>('all');

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

  const cleaningErrormessage = () => {
    setErrorMessage('');
  };

  return (
    <>
      <div className="todoapp__content">
        <TodoHeader
          onSubmit={handleSubmit}
          onTitleChange={handleTitleChange}
          title={titleMessage}
        />

        {todos.length > 0 && (
          <TodoMain todos={filtered} toggleTodo={toggleTodo} />
        )}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            currentFilter={currentFilter}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onCleaning={cleaningErrormessage}
      />
    </>
  );
};
