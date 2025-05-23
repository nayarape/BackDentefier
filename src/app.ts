"use strict";
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import casoRoutes from './routes/casoRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import evidenciaRoutes from './routes/evidenciaRoutes';
import { parseCookies } from './middlewares/authMiddleware';
// Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
dotenv.config();
const app = express();
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Configuração do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestão de Casos',
      version: '1.0.0',
      description: 'Documentação da API para sistema de gestão de casos, autenticação, usuários e evidências',
      contact: {
        name: 'Desenvolvedor',
        email: 'seu.email@exemplo.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://backdentefier-1.onrender.com'  // URL atualizada para o Render
          : `http://localhost:${process.env.PORT || 10000}`,  // Porta atualizada para 10000
        description: process.env.NODE_ENV === 'production' ? 'Servidor de produção' : 'Servidor de desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./dist/routes/*.js', './dist/models/*.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Conecta ao MongoDB
connectDB();

// Middlewares
// MODIFICAÇÃO IMPORTANTE: Configuração CORS para aceitar Netlify e localhost
app.use(cors({
  // Aceita tanto o domínio Netlify quanto localhost para desenvolvimento
  origin: ['https://dentefier.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(parseCookies);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }'
}));

// Endpoint seguro da chave da API
app.get('/api/config', (_req, res) => {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    return res.status(500).json({ error: 'GOOGLE_MAPS_API_KEY não definida' });
  }
  res.json({ googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY });
});

// Geocodificação reversa
app.get('/api/geocode', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro na geocodificação' });
  }
});

// Rotas
app.use('/api/casos', casoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/evidencias', evidenciaRoutes);

// Adicionar rota básica para verificar se a API está funcionando
app.get('/', (_req, res) => {
  res.json({ 
    status: 'online', 
    message: 'API backend funcionando!',
    docs: '/api-docs'
  });
});

// Middleware de erro
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Erro interno:', err);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// Inicia servidor
const PORT = process.env.PORT || 10000;  // Porta padrão mudada para 10000 para corresponder ao Render

// Rota para expor o JSON do Swagger
app.get('/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
