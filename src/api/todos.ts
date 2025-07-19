import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3246;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addPost = ({ title, completed }: Omit<Todo, 'id' | 'userId'>) => {
  return client.post<Todo>('/todos', { title, userId: USER_ID, completed });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updateTodo = (todoId: number) => {
  return Promise.reject(new Error('Unable to update a todo'));
};
