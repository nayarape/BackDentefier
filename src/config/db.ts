import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

    await mongoose.connect(uri);
    console.log('Conectado ao MongoDB Atlas!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB Atlas:', error);
    process.exit(1);
  }
};

export default connectDB;
