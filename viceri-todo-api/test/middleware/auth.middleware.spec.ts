import jwt from 'jsonwebtoken';

import { authenticateRoute, AuthenticatedRequest } from '../../src/routes/middlewares/auth.middleware';
import { BusinessError } from '../../src/exceptions/business.error';

describe('authenticateRoute middleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<any>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('deve lançar BusinessError se não houver token', () => {
    expect(() => authenticateRoute(req as AuthenticatedRequest, res as any, next)).toThrow(BusinessError);
  });

  it('deve retornar 401 se token for inválido', () => {
    req.headers = { authorization: 'invalid.token' };

    jest.spyOn(jwt, 'verify').mockImplementation((_token, _secret, callback: any) => {
      callback(new Error('invalid token') as any, undefined);
    });

    authenticateRoute(req as AuthenticatedRequest, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'não permitido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve adicionar user ao req e chamar next se o token for válido', () => {
    const mockDecoded = { id: 1, iat: 123456, exp: 123789 };
    req.headers = { authorization: 'valid.token' };

    jest.spyOn(jwt, 'verify').mockImplementation((_token, _secret, callback: any) => {
      callback(null, mockDecoded);
    });

    authenticateRoute(req as AuthenticatedRequest, res as any, next);

    expect(req.user).toEqual(mockDecoded);
    expect(next).toHaveBeenCalled();
  });
});
