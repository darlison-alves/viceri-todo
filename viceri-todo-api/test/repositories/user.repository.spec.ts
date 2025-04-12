import { Database } from 'sqlite';
import { UserRepository } from '../../src/repositories/user.repository';
import { UserDTO } from '../../src/dtos/user.dto';

describe('UserRepository', () => {
  let mockDb: jest.Mocked<Database>;
  let userRepository: UserRepository;

  beforeEach(() => {
    mockDb = {
      run: jest.fn(),
      get: jest.fn(),
      all: jest.fn(),
    } as any;

    userRepository = new UserRepository(mockDb);
  });

  it('should create a user and return the last inserted ID', async () => {
    mockDb.run.mockResolvedValue({ lastID: 42, changes: 1, stmt: null as any });

    const user: UserDTO = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
    };

    const result = await userRepository.create(user);

    expect(mockDb.run).toHaveBeenCalledWith(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [user.name, user.email, user.password]
    );
    expect(result).toEqual({ lastID: 42 });
  });

  it('should find a user by id and return partial user data', async () => {
    const mockUser = {
      id: 1,
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret',
    };

    mockDb.get.mockResolvedValue(mockUser);

    const result = await userRepository.findById(1);

    expect(mockDb.get).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE id = ?', [1]
    );

    expect(result).toEqual({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
    });
  });

  it('should return null if user not found by id', async () => {
    mockDb.get.mockResolvedValue(undefined);

    const result = await userRepository.findById(999);

    expect(result).toBeNull();
  });

  it('should find a user by email and return user data', async () => {
    const mockUser = {
      id: 2,
      name: 'John Smith',
      email: 'john@smith.com',
      password: 'hashed',
    };

    mockDb.get.mockResolvedValue(mockUser);

    const result = await userRepository.findByEmail('john@smith.com');

    expect(mockDb.get).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE email = ?', ['john@smith.com']
    );

    expect(result).toEqual(mockUser);
  });

  it('should return null if user not found by email', async () => {
    mockDb.get.mockResolvedValue(undefined);

    const result = await userRepository.findByEmail('notfound@email.com');

    expect(result).toBeNull();
  });
});
