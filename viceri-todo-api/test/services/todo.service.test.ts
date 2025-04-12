import { PriorityEnum } from '../../src/enums/todo.priority.enum';
import { TodoService } from '../../src/services/todo.service';

const mockTodoRepository = {
  findAllByUserId: jest.fn(),
  create: jest.fn(),
  
};

const todoService = new TodoService(mockTodoRepository as any);

describe('TodoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar todos os todos', async () => {
    const todos = [{ id: 1, title: 'Aprender testes' }];
    mockTodoRepository.findAllByUserId.mockResolvedValue(todos);

    const result = await todoService.findAllByUserId(1);

    expect(mockTodoRepository.findAllByUserId).toHaveBeenCalledWith(1);
    expect(result).toEqual(todos);
  });

  it('deve adicionar um novo todo', async () => {
    const newTodo = { lastID: 1 };
    mockTodoRepository.create.mockResolvedValue(newTodo);

    const result = await todoService.createTodo(1, { title: 'Testar código', priority: PriorityEnum.High });

    expect(mockTodoRepository.create).toHaveBeenCalledWith(1, 'Testar código', "high");
    expect(result).toMatchObject(newTodo);
  });
});
