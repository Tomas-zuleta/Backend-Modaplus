import { Request, Response, NextFunction } from 'express';
import * as devolucionService from '../services/devolucionService';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await devolucionService.getAllDevoluciones(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await devolucionService.getDevolucionById(id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await devolucionService.createDevolucion(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function updateEstado(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const { estado, observacion } = req.body;
    const result = await devolucionService.updateDevolucionEstado(id, estado, observacion);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
