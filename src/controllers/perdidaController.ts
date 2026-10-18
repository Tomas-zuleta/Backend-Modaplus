import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { handleError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response) => {
  try {
    const perdidas = await prisma.perdida.findMany({
      include: {
        devolucion: { include: { venta: true, cliente: true } },
        variante: { include: { producto: true, talla: true, color: true } },
      },
      orderBy: { fecha_registro: 'desc' },
    });
    res.json(perdidas);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const perdida = await prisma.perdida.findUnique({
      where: { id_perdida: Number(id) },
      include: {
        devolucion: true,
        variante: { include: { producto: true, talla: true, color: true } },
      },
    });
    if (!perdida) return res.status(404).json({ message: 'Pérdida no encontrada' });
    res.json(perdida);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { id_devolucion, id_variante, cantidad, motivo, descripcion, estado } = req.body;
    const perdida = await prisma.perdida.create({
      data: {
        id_devolucion,
        id_variante,
        cantidad,
        motivo,
        descripcion,
        estado: estado || 'REGISTRADA',
      },
      include: {
        variante: { include: { producto: true, talla: true, color: true } },
      },
    });
    res.status(201).json(perdida);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cantidad, motivo, descripcion, estado } = req.body;
    const perdida = await prisma.perdida.update({
      where: { id_perdida: Number(id) },
      data: { cantidad, motivo, descripcion, estado },
      include: {
        devolucion: true,
        variante: true,
      },
    });
    res.json(perdida);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const deletePerdida = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.perdida.delete({ where: { id_perdida: Number(id) } });
    res.status(204).send();
  } catch (error: any) {
    handleError(res, error);
  }
};

export const annul = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const perdida = await prisma.perdida.update({
      where: { id_perdida: Number(id) },
      data: { estado: 'ANULADA', fecha_estado: new Date() },
    });
    res.json(perdida);
  } catch (error: any) {
    handleError(res, error);
  }
};
