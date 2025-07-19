import React, { useEffect, useRef } from 'react';

type Props = {
  onSubmit: (event: React.FormEvent) => void;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
};

export const TodoHeader: React.FC<Props> = ({
  onSubmit,
  onTitleChange,
  title,
}) => {
  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputFocus.current?.focus();
  }, []);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          ref={inputFocus}
          placeholder="What needs to be done?"
          value={title}
          onChange={onTitleChange}
        />
      </form>
    </header>
  );
};
