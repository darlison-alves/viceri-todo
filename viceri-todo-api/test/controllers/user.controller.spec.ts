import { UserController } from '../../src/controllers/user.controller';
import { UserService } from '../../src/services/user.service';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../src/routes/middlewares/auth.middleware';

describe('UserController', () => {
  let userService: jest.Mocked<UserService>;
  let userController: UserController;
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    userService = {
      createUser: jest.fn(),
      getUserById: jest.fn(),
      authenticate: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    userController = new UserController(userService);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('create', () => {
    it('deve criar um novo usuário e retornar status 201', async () => {
      const mockUser = { lastID: 1 };
      req.body = { name: 'João', email: 'joao@email.com', password: '123456' };

      userService.createUser.mockResolvedValue({ lastID: 1 });

      await userController.create(req as Request, res as Response);

      expect(userService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getById', () => {
    it('deve retornar o usuário quando encontrado', async () => {
      const mockUser = { id: 1, name: 'João', email: 'joao@email.com' };
      req.user = { id: 1 } as any;

      userService.getUserById.mockResolvedValue(mockUser);

      await userController.getById(req as any, res as Response);

      expect(userService.getUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('deve retornar 404 quando o usuário não for encontrado', async () => {
      req.user = { id: 2 } as any;

      userService.getUserById.mockResolvedValue(null as any);

      await userController.getById(req as any, res as Response);

      expect(userService.getUserById).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });

  describe('authenticate', () => {
    it('deve autenticar o usuário e retornar um token', async () => {
      req.body = { email: 'joao@email.com', password: '123456' };
      const token = 'mocked.jwt.token';

      userService.authenticate.mockResolvedValue(token);

      await userController.authenticate(req as Request, res as Response);

      expect(userService.authenticate).toHaveBeenCalledWith(req.body.email, req.body.password);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token });
    });
  });
});
