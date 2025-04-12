import { TodoController } from '../../src/controllers/todo.controller';
import { TodoService } from '../../src/services/todo.service';
import { AuthenticatedRequest } from '../../src/routes/middlewares/auth.middleware';

import { Request, Response } from 'express';
import { TodoDTO } from '../../src/dtos/todo.dto';
import { PriorityEnum } from '../../src/enums/todo.priority.enum';
import { ITodoCreate } from '../../src/interfaces/todo.interfaces';
import { title } from 'process';

describe('TodoController', () => {
  let todoService: jest.Mocked<TodoService>;
  let todoController: TodoController;
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    todoService = {
      findAllByUserId: jest.fn(),
      createTodo: jest.fn(),
      updateTodo: jest.fn(),
      deleteTodo: jest.fn()
    } as unknown as jest.Mocked<TodoService>;

    todoController = new TodoController(todoService);

    req = { }
        
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  describe('getAll', () => {
    it('deve retornar todos os todos do usuário', async () => {
      const mockUserId = 1;
      const mockTodos = [{ id: 1, title: 'Estudar', priority: 'Alta' }];
      req.user = { id: mockUserId } as any;

      todoService.findAllByUserId.mockResolvedValue(mockTodos);

      await todoController.getAll(req as any, res as Response);

      expect(todoService.findAllByUserId).toHaveBeenCalledWith(mockUserId);
      expect(res.json).toHaveBeenCalledWith(mockTodos);
    });
  });

  describe('create', () => {
    it('deve criar um novo todo', async () => {
      const mockUserId = 1;
      const createdTodo: ITodoCreate = { lastID: 1 };

      req.user = { id: mockUserId } as any;
      req.body = { title: 'Estudar', priority: PriorityEnum.High };
      todoService.createTodo.mockResolvedValue(createdTodo);

      await todoController.create(req as any, res as Response);

      expect(todoService.createTodo).toHaveBeenCalledWith(mockUserId, { priority: PriorityEnum.High, title: "Estudar" } as TodoDTO);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdTodo);
    });
  });

  describe('update', () => {
    it('deve atualizar um todo', async () => {
      req.params = { id: '1' };
      req.body = { done: true };

      await todoController.update(req as Request, res as Response);

      expect(todoService.updateTodo).toHaveBeenCalledWith(1, true);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deve deletar um todo', async () => {
      req.params = { id: '1' };

      await todoController.delete(req as Request, res as Response);

      expect(todoService.deleteTodo).toHaveBeenCalledWith(1);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
