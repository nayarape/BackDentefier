// src/controllers/evidenciaController.ts
import { Request, Response } from 'express';
import Evidencia from '../models/Evidencia';
import Caso from '../models/Caso';
import mongoose from 'mongoose';

export const createEvidencia = async (req: Request, res: Response) => {
  try {
    const { casoId, tipo, descricao, responsavelColeta, dataColeta, registradoPor } = req.body;
    const file = req.file;

    if (!mongoose.Types.ObjectId.isValid(casoId))
      return res.status(400).json({ message: 'ID de caso inválido' });
    const caso = await Caso.findById(casoId);
    if (!caso) return res.status(404).json({ message: 'Caso não encontrado' });

    const nova: any = {
      caso: casoId,
      tipo,
      descricao,
      responsavelColeta,
      dataColeta: dataColeta ? new Date(dataColeta) : undefined,
      registradoPor
    };

    if (file) {
      nova.arquivo = {
        data: file.buffer,
        contentType: file.mimetype,
        filename: file.originalname
      };
    }

    const evidencia = new Evidencia(nova);
    await evidencia.save();
    res.status(201).json({ message: 'Evidência criada com sucesso', evidencia });
  } catch (error) {
    console.error('Erro ao criar evidência:', error);
    res.status(500).json({ message: 'Erro ao criar evidência', error });
  }
};

export const listEvidenciasByCaso = async (req: Request, res: Response) => {
  try {
    const { casoId } = req.params;
    const evidencias = await Evidencia.find({ caso: casoId })
      .select('-arquivo.data')
      .populate('registradoPor', 'username')
      .sort({ createdAt: -1 });
    res.json({ evidencias });
  } catch (error) {
    console.error('Erro ao listar evidências:', error);
    res.status(500).json({ message: 'Erro ao listar evidências', error });
  }
};

export const downloadEvidenciaFile = async (req: Request, res: Response) => {
  try {
    const ev = await Evidencia.findById(req.params.id);
    if (!ev || !ev.arquivo?.data) return res.status(404).json({ message: 'Arquivo não encontrado' });
    res.set('Content-Type', ev.arquivo.contentType);
    res.set('Content-Disposition', `attachment; filename=\"${ev.arquivo.filename}\"`);
    res.send(ev.arquivo.data);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao baixar arquivo', err });
  }
};

export const getEvidenciaById = async (req: Request, res: Response) => {
  try {
    const evidencia = await Evidencia.findById(req.params.id)
      .populate('registradoPor', 'username');
    if (!evidencia) return res.status(404).json({ message: 'Evidência não encontrada' });

    const obj = evidencia.toObject();
    if (evidencia.arquivo?.data) {
      obj.arquivo = {
        filename: evidencia.arquivo.filename,
        contentType: evidencia.arquivo.contentType,
        data: evidencia.arquivo.data.toString('base64')
      };
    }

    res.json(obj);
  } catch (error) {
    console.error('Erro ao obter evidência:', error);
    res.status(500).json({ message: 'Erro ao obter evidência', error });
  }
};

interface AuthRequest extends Request {
  user?: any; // Adjust the type of 'user' based on your authentication logic
}

export const updateEvidencia = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const file = req.file;
    const { tipo, descricao, responsavelColeta, dataColeta } = req.body;

    // 1) Busca a evidência para manter registradoPor
    const existing = await Evidencia.findById(id).select('registradoPor');
    if (!existing) return res.status(404).json({ message: 'Evidência não encontrada' });

    // 2) Monta objeto de atualização
    const update: any = { tipo, descricao, responsavelColeta };
    if (dataColeta) update.dataColeta = new Date(dataColeta);
    if (file) {
      update.arquivo = {
        data: file.buffer,
        contentType: file.mimetype,
        filename: file.originalname
      };
    }
    update.registradoPor = existing.registradoPor; // preserva quem cadastrou

    // 3) Executa o update garantindo validação
    const updated = await Evidencia.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true
    });
    return res.json({ message: 'Evidência atualizada com sucesso', evidencia: updated });
  } catch (error) {
    console.error('Erro ao atualizar evidência:', error);
    return res.status(500).json({ message: 'Erro ao atualizar evidência', error });
  }
};

export const deleteEvidencia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ev = await Evidencia.findByIdAndDelete(id);
    if (!ev) return res.status(404).json({ message: 'Evidência não encontrada para exclusão' });
    res.json({ message: 'Evidência excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir evidência:', error);
    res.status(500).json({ message: 'Erro ao excluir evidência', error });
  }
};