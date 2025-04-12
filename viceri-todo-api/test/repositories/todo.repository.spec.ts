import { TodoRepository } from '../../src/repositories/todo.repository';
import { Database } from 'sqlite';
import { PriorityEnum } from '../../src/enums/todo.priority.enum';

describe('TodoRepository', () => {
  let db: jest.Mocked<Database>;
  let repository: TodoRepository;

  beforeEach(() => {
    db = {
      all: jest.fn(),
      run: jest.fn()
    } as any;

    repository = new TodoRepository(db);
  });

  describe('findAllByUserId', () => {
    it('deve retornar todos os todos de um usuário que ainda não estão finalizados', async () => {
      const userId = 1;
      const todos = [{ id: 1, title: 'Teste', done: 0, userId: 1 }];
      db.all.mockResolvedValue(todos);

      const result = await repository.findAllByUserId(userId);

      expect(db.all).toHaveBeenCalledWith(
        'SELECT * FROM todos where done = 0 and userId = ?',
        [userId]
      );
      expect(result).toEqual(todos);
    });
  });

  describe('create', () => {
    it('deve criar um novo todo e retornar o lastID', async () => {
      const userId = 1;
      const title = 'Novo Todo';
      const priority = PriorityEnum.High;

      db.run.mockResolvedValue({ changes: 1, lastID: 123, stmt: null as any });

      const result = await repository.create(userId, title, priority);

      expect(db.run).toHaveBeenCalledWith(
        'INSERT INTO todos (title, priority, userId) VALUES (?, ?, ?)',
        [title, priority, userId]
      );
      expect(result).toEqual({ lastID: 123 });
    });
  });

  describe('update', () => {
    it('deve atualizar o status de done de um todo', async () => {
      const id = 1;
      const done = true;

      db.run.mockResolvedValue(null as any);

      await repository.update(id, done);

      expect(db.run).toHaveBeenCalledWith(
        'UPDATE todos SET done = ? WHERE id = ?',
        [done, id]
      );
    });
  });

  describe('delete', () => {
    it('deve deletar um todo pelo id', async () => {
      const id = 1;

      db.run.mockResolvedValue(null as any);

      await repository.delete(id);

      expect(db.run).toHaveBeenCalledWith(
        'DELETE FROM todos WHERE id = ?',
        [id]
      );
    });
  });
});
