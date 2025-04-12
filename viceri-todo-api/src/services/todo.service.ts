import { TodoDTO } from '../dtos/todo.dto';
import { TodoRepository } from '../repositories/todo.repository';

export class TodoService {
  constructor(private todoRepo: TodoRepository) {}

  findAllByUserId(userId: number) {
    return this.todoRepo.findAllByUserId(userId);
  }

  createTodo(userId: number, todoDTO: TodoDTO) {
    if (!todoDTO.title || todoDTO.title.trim() === '') {
      throw new Error('Title is required');
    }
    return this.todoRepo.create(userId, todoDTO.title, todoDTO.priority);
  }

  updateTodo(id: number, done: boolean) {
    return this.todoRepo.update(id, done);
  }

  deleteTodo(id: number) {
    return this.todoRepo.delete(id);
  }
}
