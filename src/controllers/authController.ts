// src/controllers/authController.ts

import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '2h';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username e senha são obrigatórios' });
    }

    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // Gera o token
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // Envia o token no cookie HttpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 1000 * 60 * 60 * 2 // 2 horas
    });

    // Retorna apenas a mensagem e os dados do usuário (sem expor o token)
    return res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, role, email } = req.body;
    if (!username || !password || !role || !email) {
      return res.status(400).json({
        message: 'Campos obrigatórios faltando: username, password, role, email'
      });
    }

    const existing = await User.findOne({
      $or: [{ username }, { email: email.toLowerCase() }]
    });
    if (existing) {
      return res.status(409).json({ message: 'Nome de usuário ou email já está em uso' });
    }

    const newUser = new User({
      username,
      password,
      role,
      email: email.toLowerCase()
    });

    await newUser.save();
    return res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

export const logout = (_req: Request, res: Response) => {
  // Limpa o cookie de autenticação
  res.clearCookie('token', { httpOnly: true, sameSite: 'strict', path: '/' });
  return res.json({ message: 'Logout realizado com sucesso' });
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};
