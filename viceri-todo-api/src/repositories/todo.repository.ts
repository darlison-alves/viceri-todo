import { Database } from 'sqlite'
import { ITodoCreate } from '../interfaces/todo.interfaces';
import { PriorityEnum } from '../enums/todo.priority.enum';

export class TodoRepository {
  constructor(private db: Database) {}

  async findAllByUserId(userId: number): Promise<any[]> {
    return this.db.all('SELECT * FROM todos where done = 0 and userId = ?', [userId]);
  }

  async create(userId: number, title: string, priority: PriorityEnum): Promise<ITodoCreate> {
    const result = await this.db.run('INSERT INTO todos (title, priority, userId) VALUES (?, ?, ?)', [title, priority, userId]);
    
    return {
      lastID: result.lastID
    }
  }

  async update(id: number, done: boolean) {
    return this.db.run('UPDATE todos SET done = ? WHERE id = ?', [done, id]);
  }

  async delete(id: number) {
    return this.db.run('DELETE FROM todos WHERE id = ?', [id]);
  }
}
