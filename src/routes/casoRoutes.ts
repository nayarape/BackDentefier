/**
 * @swagger
 * tags:
 *   name: Casos
 *   description: Gerenciamento de casos
 */

/**
 * @swagger
 * /api/casos:
 *   get:
 *     summary: Recupera lista de todos os casos
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrar por status do caso
 *       - in: query
 *         name: prioridade
 *         schema:
 *           type: string
 *         description: Filtrar por prioridade
 *       - in: query
 *         name: designadoPara
 *         schema:
 *           type: string
 *         description: ID do usuário designado
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de casos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 casos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Caso'
 *                 total:
 *                   type: integer
 *                   description: Total de casos
 *                 paginas:
 *                   type: integer
 *                   description: Total de páginas
 *                 paginaAtual:
 *                   type: integer
 *                   description: Página atual
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 *
 *   post:
 *     summary: Cria um novo caso
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - status
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [aberto, em_andamento, fechado, arquivado]
 *               prioridade:
 *                 type: string
 *                 enum: [baixa, media, alta, critica]
 *               tipo:
 *                 type: string
 *               dataOcorrencia:
 *                 type: string
 *                 format: date-time
 *               localizacao:
 *                 type: object
 *                 properties:
 *                   endereco:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *               designadoPara:
 *                 type: string
 *                 description: ID do usuário designado
 *     responses:
 *       201:
 *         description: Caso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/casos/{id}:
 *   get:
 *     summary: Recupera um caso pelo ID
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso
 *     responses:
 *       200:
 *         description: Detalhes do caso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado
 *       401:
 *         description: Não autorizado
 *
 *   put:
 *     summary: Atualiza um caso existente
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso
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
 *               status:
 *                 type: string
 *               prioridade:
 *                 type: string
 *               designadoPara:
 *                 type: string
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Caso não encontrado
 *       401:
 *         description: Não autorizado
 *
 *   delete:
 *     summary: Remove um caso
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso
 *     responses:
 *       200:
 *         description: Caso removido com sucesso
 *       404:
 *         description: Caso não encontrado
 *       401:
 *         description: Não autorizado
 */

// O resto do seu código de rotas continua abaixo...
import { Router } from 'express';
import { createCaso, listCasos, updateCaso, deleteCaso, getCasoById } from '../controllers/casoController';
import { parseCookies, authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();
router.use(parseCookies);

router.post('/', authenticateJWT, authorizeRoles('admin', 'perito'), createCaso);
router.get('/', authenticateJWT, authorizeRoles('admin', 'perito', 'assistente'), listCasos); 
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'perito', 'assistente'), getCasoById);
router.put('/:id', authenticateJWT, authorizeRoles('admin', 'perito'), updateCaso);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), deleteCaso);

export default router;
