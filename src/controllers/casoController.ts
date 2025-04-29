import { Request, Response } from 'express';
import Caso from '../models/Caso';
import Evidencia from '../models/Evidencia';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createCaso = async (req: AuthRequest, res: Response) => {
  try {
    const { lat, lng, enderecoCompleto, ...rest } = req.body;
    const localizacao = lat && lng
      ? { lat: +lat, lng: +lng, enderecoCompleto }
      : undefined;

    const novo = new Caso({
      ...rest,
      responsavel: req.user!.id,
      localizacao,
      dataAbertura: new Date(rest.dataAbertura)
    });
    await novo.save();
    res.status(201).json({ message: 'Caso criado com sucesso', caso: novo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar caso', err });
  }
};


export const listCasos = async (req: Request, res: Response) => {
  try {
    const casos = await Caso.find();
    res.json(casos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar casos', error });
  }
};

export const updateCaso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCaso = await Caso.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: 'Caso atualizado', caso: updatedCaso });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar caso', error });
  }
};

export const deleteCaso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Caso.findByIdAndDelete(id);
    res.json({ message: 'Caso excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir caso', error });
  }
};

export const getCasoById = async (req: Request, res: Response) => {
  try {
    // Pega o caso e popula quem é o perito responsável
    const caso = await Caso.findById(req.params.id)
      .populate('responsavel', 'username');
    if (!caso) return res.status(404).json({ message: 'Caso não encontrado' });

    // Puxa todas as evidências e popula quem as registrou
    const evidencias = await Evidencia.find({ caso: caso._id })
      .populate('registradoPor', 'username')
      .sort({ createdAt: -1 });

    res.json({ caso, evidencias });
  } catch (error) {
    console.error('Erro ao obter caso:', error);
    res.status(500).json({ message: 'Erro ao obter caso', error });
  }
};

