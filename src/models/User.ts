// Adicione este bloco de comentários no início do seu arquivo User.js

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único gerado pelo MongoDB
 *         nome:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário (único)
 *         senha:
 *           type: string
 *           format: password
 *           description: Senha do usuário (armazenada com hash)
 *         cargo:
 *           type: string
 *           description: Cargo ou função do usuário
 *         departamento:
 *           type: string
 *           description: Departamento ao qual o usuário pertence
 *         permissoes:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de permissões do usuário
 *         ativo:
 *           type: boolean
 *           default: true
 *           description: Indica se o usuário está ativo no sistema
 *         criadoEm:
 *           type: string
 *           format: date-time
 *           description: Data de criação do usuário
 *       example:
 *         nome: João Silva
 *         email: joao@exemplo.com
 *         cargo: Investigador
 *         departamento: Investigação
 *         permissoes: ['ler_casos', 'editar_casos']
 *         ativo: true
 */



import mongoose, { Schema, Document, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface do Usuário
export interface IUser extends Document {
  username: string;
  password: string;
  role: 'admin' | 'perito' | 'assistente';
  email: string;
  phone?: string;
  department?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Esquema do Usuário
const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'O nome de usuário é obrigatório'],
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'A senha é obrigatória'],
      minlength: [8, 'A senha deve ter pelo menos 8 caracteres'],
      select: false
    },
    role: {
      type: String,
      enum: ['admin', 'perito', 'assistente'],
      required: [true, 'O papel do usuário é obrigatório']
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório'],
      unique: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    department: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Hash da senha antes de salvar
UserSchema.pre<IUser>('save', async function (next: (err?: CallbackError) => void) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Método para comparar a senha
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);

