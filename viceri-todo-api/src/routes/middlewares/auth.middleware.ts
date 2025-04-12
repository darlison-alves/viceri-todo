import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { JWT_SECRET } from "../../config.js";
import { BusinessError } from "../../exceptions/business.error.js";

export interface AuthenticatedRequest extends Request {
    user?: { id: number, iat: number, exp: number };
}

export function authenticateRoute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    if (!token) {
        throw new BusinessError('não permitido', 401);
    }
    
    jwt.verify(token, JWT_SECRET, (err: VerifyErrors | null , decoded: any) => {
        if (err) {
            return res.status(401).json({ message: 'não permitido' });
        }
        req.user = decoded;
        next();
    });
};