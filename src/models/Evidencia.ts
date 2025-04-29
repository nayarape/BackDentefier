// models/Evidencia.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IEvidencia extends Document {
  caso: mongoose.Types.ObjectId;
  tipo: string;
  descricao: string;
  arquivo?: {
    data: Buffer;
    contentType: string;
    filename: string;
  };
  dataColeta: Date;
  responsavelColeta?: string;
  registradoPor: mongoose.Types.ObjectId;     // ← novo
}

const EvidenciaSchema: Schema = new Schema({
  caso:      { type: Schema.Types.ObjectId, ref: 'Caso', required: true },
  tipo:      { type: String, required: [true, 'Tipo da evidência é obrigatório'] },
  descricao: { type: String, required: [true, 'Descrição é obrigatória'] },
  arquivo: {
    data:        { type: Buffer },
    contentType: { type: String },
    filename:    { type: String }
  },
  dataColeta:        { type: Date, default: Date.now },
  responsavelColeta: { type: String },
  registradoPor:     { type: Schema.Types.ObjectId, ref: 'User', required: true }  // ← novo
}, {
  timestamps: true
});

export default mongoose.model<IEvidencia>('Evidencia', EvidenciaSchema);
