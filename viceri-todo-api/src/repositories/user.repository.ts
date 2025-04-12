import { Database } from 'sqlite'
import { UserDTO } from '../dtos/user.dto';

interface IUserCreate {
  lastID: number;
}

export class UserRepository {
  constructor(private db: Database) {}

  async create(user: UserDTO): Promise<IUserCreate> {

    const { email, name, password } = user;

    const result = await this.db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
      [name, email, password]);
    
    return {
      lastID: result.lastID!
    }
  }

  async findById(id: number): Promise<Partial<UserDTO> | null> {
    const user = await this.db.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    const user = await this.db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    };
  }
}
