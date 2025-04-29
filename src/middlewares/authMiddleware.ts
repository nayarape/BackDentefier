// src/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

export interface AuthRequest extends Request {
  user?: {
    username: any;
    id: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || '';

// Extrai cookie `token` para `req.cookies`
export const parseCookies = cookieParser();

// Verifica e decodifica JWT, preenche `req.user`
export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.substring(7);
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthRequest['user'];
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT inválido:', err);
    return res.status(403).json({ message: 'Token inválido.' });
  }
};

// Garante que apenas usuários com roles permitidos avancem
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
    }
    next();
  };
};
