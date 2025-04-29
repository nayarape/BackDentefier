/**
 * @swagger
 * components:
 *   schemas:
 *     Caso:
 *       type: object
 *       required:
 *         - titulo
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único gerado pelo MongoDB
 *         numero:
 *           type: string
 *           description: Número identificador do caso
 *         titulo:
 *           type: string
 *           description: Título ou nome do caso
 *         descricao:
 *           type: string
 *           description: Descrição detalhada do caso
 *         status:
 *           type: string
 *           enum: [aberto, em_andamento, fechado, arquivado]
 *           description: Status atual do caso
 *         prioridade:
 *           type: string
 *           enum: [baixa, media, alta, critica]
 *           description: Nível de prioridade do caso
 *         tipo:
 *           type: string
 *           description: Tipo ou categoria do caso
 *         dataOcorrencia:
 *           type: string
 *           format: date-time
 *           description: Data em que o incidente ocorreu
 *         localizacao:
 *           type: object
 *           properties:
 *             endereco:
 *               type: string
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *           description: Dados de localização do caso
 *         designadoPara:
 *           type: string
 *           description: ID do usuário responsável pelo caso
 *         evidencias:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de IDs de evidências relacionadas ao caso
 *         historico:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 format: date-time
 *               usuario:
 *                 type: string
 *               acao:
 *                 type: string
 *               detalhes:
 *                 type: string
 *           description: Histórico de atualizações do caso
 *         criadoPor:
 *           type: string
 *           description: ID do usuário que criou o caso
 *         criadoEm:
 *           type: string
 *           format: date-time
 *           description: Data de criação do caso
 *         atualizadoEm:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização do caso
 *       example:
 *         titulo: "Investigação de Fraude"
 *         descricao: "Possível fraude identificada no departamento financeiro"
 *         status: "em_andamento"
 *         prioridade: "alta"
 *         tipo: "Fraude Interna"
 *         dataOcorrencia: "2023-04-15T10:00:00Z"
 *         localizacao: {
 *           endereco: "Av. Paulista, 1000, São Paulo - SP",
 *           latitude: -23.5505,
 *           longitude: -46.6333
 *         }
 */



import mongoose, { Schema, Document } from 'mongoose';

export interface ICaso extends Document {
  numeroCaso: string;
  titulo: string;
  dataAbertura: Date;
  responsavel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  };
  status: 'Em andamento' | 'Finalizado' | 'Arquivado';
  contexto: {
    tipoCaso: string;
    origemDemanda: string;
    descricao: string;
  };
  dadosIndividuo: {
    nome?: string;
    idadeEstimado?: number;
    sexo?: string;
    etnia?: string;
    identificadores?: string;
    antecedentes?: string;
  };
  cadeiaCustodia: {
    dataColeta?: Date;
    responsavelColeta?: string;
  };
  historico: Array<{
    data: Date;
    justificativa: string;
    substatus?: string;
  }>;
  localizacao?: {
    lat: number;
    lng: number;
    enderecoCompleto?: string;
  };
}

const CasoSchema: Schema = new Schema({
  numeroCaso:   { type: String, required: true, unique: true },
  titulo:       { type: String, required: true },
  dataAbertura: { type: Date,   required: true },
  responsavel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
    status:       { type: String, enum: ['Em andamento', 'Finalizado', 'Arquivado'], required: true },
  contexto: {
    tipoCaso:     { type: String, required: true },
    origemDemanda:{ type: String, required: true },
    descricao:    { type: String, required: true }
  },
  dadosIndividuo: {
    nome:          { type: String },
    idadeEstimado: { type: Number },
    sexo:          { type: String },
    etnia:         { type: String },
    identificadores: { type: String },
    antecedentes:  { type: String }
  },
  cadeiaCustodia: {
    dataColeta:      { type: Date },
    responsavelColeta:{ type: String }
  },
  historico: [
    {
      data:         { type: Date },
      responsavel:  { type: String },
      justificativa:{ type: String },
      substatus:    { type: String }
    }
  ],
  localizacao: {
    lat:             { type: Number },
    lng:             { type: Number },
    enderecoCompleto:{ type: String }
  }
}, {
  timestamps: true
});

export default mongoose.model<ICaso>('Caso', CasoSchema);
