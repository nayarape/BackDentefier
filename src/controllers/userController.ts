// src/controllers/userController.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import { AuthRequest, authenticateJWT } from '../middlewares/authMiddleware';
import mongoose from 'mongoose';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password, role, email, phone, department } = req.body;
    if (!username || !password || !role || !email) {
      return res.status(400).json({
        message: 'Campos obrigatórios faltando: username, password, role, email',
        requiredFields: ['username', 'password', 'role', 'email']
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
      const conflictField = existingUser.username === username ? 'username' : 'email';
      return res.status(409).json({ message: `${conflictField} já está em uso`, conflictField });
    }

    const newUser = await User.create({
      username,
      password,
      role,
      email: email.toLowerCase(),
      phone,
      department
    });

    res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser });
  } catch (error) {
    handleControllerError(error, res, 'Erro ao registrar usuário');
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const { search = '', page = 1, limit = 10, sort = 'username', order = 'asc', role } = req.query;
    
    const query: any = {
      $or: [
        { username: { $regex: search.toString(), $options: 'i' } },
        { email: { $regex: search.toString(), $options: 'i' } },
        { phone: { $regex: search.toString(), $options: 'i' } }
      ]
    };

    if (role) query.role = role;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ [sort.toString()]: order === 'asc' ? 1 : -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      User.countDocuments(query)
    ]);

    res.json({ 
      data: users,
      pagination: { 
        page: Number(page), 
        limit: Number(limit), 
        total, 
        totalPages: Math.ceil(total / Number(limit)) 
      }
    });
  } catch (error) {
    handleControllerError(error, res, 'Erro ao listar usuários');
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado', resourceId: req.params.id });
    res.json(user);
  } catch (error) {
    handleControllerError(error, res, 'Erro ao buscar usuário');
  }
};

// **NOVO**: retorna o usuário logado (id e username)
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id; // req.user vem do middleware authenticateJWT

    const user = await User.findById(userId).select('-password'); // remove a senha da resposta

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário autenticado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.password;
    delete updateData.role;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'Usuário não encontrado para atualização', resourceId: id });
    res.json({ message: 'Usuário atualizado com sucesso', user: updatedUser });
  } catch (error) {
    handleControllerError(error, res, 'Erro ao atualizar usuário');
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id).select('-password');
    if (!deletedUser) return res.status(404).json({ message: 'Usuário não encontrado para exclusão', resourceId: id });
    res.json({ message: 'Usuário excluído com sucesso', deletedUser });
  } catch (error) {
    handleControllerError(error, res, 'Erro ao excluir usuário');
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Ambas as senhas são obrigatórias', requiredFields: ['currentPassword', 'newPassword'] });

    const user = await User.findById(userId).select('+password');
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado', resourceId: userId });

    if (!(await user.comparePassword(currentPassword))) return res.status(401).json({ message: 'Senha atual incorreta' });
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    handleControllerError(error, res, 'Erro ao alterar senha');
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: 'Nova senha é obrigatória' });

    const user = await User.findById(id).select('+password');
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado', resourceId: id });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    handleControllerError(error, res, 'Erro ao redefinir senha');
  }
};

const handleControllerError = (error: unknown, res: Response, defaultMessage: string) => {
  console.error(defaultMessage + ':', error);
  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ message: 'Erro de validação', errors });
  }
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: 'ID inválido', invalidId: error.value });
  }
  res.status(500).json({ message: 'Erro interno no servidor', error: process.env.NODE_ENV === 'development' ? error : undefined });
};
