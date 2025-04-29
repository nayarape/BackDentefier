// src/routes/userRoutes.ts
import { Router } from 'express';
import {
  registerUser,
  listUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  deleteUser,
  resetPassword,
  changePassword
} from '../controllers/userController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// 1. Cadastro de novo usuário (apenas administradores)
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('admin'),
  registerUser
);

// 2. Listagem e busca de usuários (admin, perito, assistente)
router.get(
  '/',
  authenticateJWT,
  authorizeRoles('admin', 'perito', 'assistente'),
  listUsers
);

// 3. **Rota “me” deve vir antes de “/:id”** para não ser interpretada como um ID
router.get(
  '/me',
  authenticateJWT,
  getCurrentUser
);

// 4. Detalhes de um usuário por ID (admin, perito, assistente)
router.get(
  '/:id',
  authenticateJWT,
  authorizeRoles('admin', 'perito', 'assistente'),
  getUserById
);

// 5. Atualização de usuário (apenas admin)
router.put(
  '/:id',
  authenticateJWT,
  authorizeRoles('admin'),
  updateUser
);

// 6. Exclusão de usuário (apenas admin)
router.delete(
  '/:id',
  authenticateJWT,
  authorizeRoles('admin'),
  deleteUser
);

// 7. Reset de senha de um usuário (admin)
router.put(
  '/reset-password/:id',
  authenticateJWT,
  authorizeRoles('admin'),
  resetPassword
);

// 8. Alteração de senha pelo próprio usuário (qualquer usuário autenticado)
router.put(
  '/change-password',
  authenticateJWT,
  changePassword
);

export default router;
