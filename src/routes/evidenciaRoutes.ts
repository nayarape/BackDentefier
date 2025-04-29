
/**
 * @swagger
 * tags:
 *   name: Evidências
 *   description: Gerenciamento de evidências
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Evidencia:
 *       type: object
 *       required:
 *         - titulo
 *         - tipo
 *         - caso
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único gerado pelo MongoDB
 *         titulo:
 *           type: string
 *           description: Título da evidência
 *         descricao:
 *           type: string
 *           description: Descrição detalhada da evidência
 *         tipo:
 *           type: string
 *           enum: [documento, foto, video, audio, outro]
 *           description: Tipo da evidência
 *         arquivoUrl:
 *           type: string
 *           description: URL do arquivo da evidência
 *         tamanhoArquivo:
 *           type: number
 *           description: Tamanho do arquivo em bytes
 *         caso:
 *           type: string
 *           description: ID do caso ao qual a evidência pertence
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags para categorizar a evidência
 *         metadados:
 *           type: object
 *           description: Metadados adicionais do arquivo
 *         criadoPor:
 *           type: string
 *           description: ID do usuário que adicionou a evidência
 *         criadoEm:
 *           type: string
 *           format: date-time
 *           description: Data de criação da evidência
 *       example:
 *         titulo: "Documento financeiro"
 *         descricao: "Extrato bancário mostrando transação suspeita"
 *         tipo: "documento"
 *         caso: "60d21b4f8e8f3d001f3c9999"
 *         tags: ["financeiro", "extrato"]
 */

/**
 * @swagger
 * /api/evidencias:
 *   get:
 *     summary: Recupera todas as evidências
 *     tags: [Evidências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: caso
 *         schema:
 *           type: string
 *         description: Filtrar por ID do caso
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de evidência
 *     responses:
 *       200:
 *         description: Lista de evidências
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evidencia'
 *       401:
 *         description: Não autorizado
 *
 *   post:
 *     summary: Adiciona uma nova evidência
 *     tags: [Evidências]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - tipo
 *               - caso
 *               - arquivo
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [documento, foto, video, audio, outro]
 *               caso:
 *                 type: string
 *                 description: ID do caso
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               arquivo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Evidência adicionada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evidencia'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/evidencias/{id}:
 *   get:
 *     summary: Recupera uma evidência pelo ID
 *     tags: [Evidências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da evidência
 *     responses:
 *       200:
 *         description: Detalhes da evidência
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evidencia'
 *       404:
 *         description: Evidência não encontrada
 *       401:
 *         description: Não autorizado
 *
 *   put:
 *     summary: Atualiza uma evidência existente
 *     tags: [Evidências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da evidência
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Evidência atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evidencia'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Evidência não encontrada
 *       401:
 *         description: Não autorizado
 *
 *   delete:
 *     summary: Remove uma evidência
 *     tags: [Evidências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da evidência
 *     responses:
 *       200:
 *         description: Evidência removida com sucesso
 *       404:
 *         description: Evidência não encontrada
 *       401:
 *         description: Não autorizado
 */

// O resto do seu código de rotas continua abaixo...

// src/routes/evidenciaRoutes.ts
import { Router } from 'express';
import multer from 'multer';
import {
  createEvidencia,
  listEvidenciasByCaso,
  getEvidenciaById,
  updateEvidencia,
  deleteEvidencia,
  downloadEvidenciaFile
} from '../controllers/evidenciaController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  authenticateJWT,
  authorizeRoles('admin', 'assistente'),
  upload.single('arquivo'),
  createEvidencia
);

router.get(
  '/:id/arquivo',
  authenticateJWT,
  authorizeRoles('admin', 'perito', 'assistente'),
  downloadEvidenciaFile
);

router.get(
  '/caso/:casoId',
  authenticateJWT,
  authorizeRoles('admin', 'perito', 'assistente'),
  listEvidenciasByCaso
);

router.get(
  '/:id',
  authenticateJWT,
  authorizeRoles('admin', 'perito', 'assistente'),
  getEvidenciaById
);

router.put(
  '/:id',
  authenticateJWT,
  authorizeRoles('admin'),
  upload.single('arquivo'),
  updateEvidencia
);

router.delete(
  '/:id',
  authenticateJWT,
  authorizeRoles('admin'),
  deleteEvidencia
);

export default router;