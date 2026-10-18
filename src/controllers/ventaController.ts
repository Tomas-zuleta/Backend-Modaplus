import { Request, Response, NextFunction } from 'express';
import * as ventaService from '../services/ventaService';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await ventaService.getAllVentas(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await ventaService.getVentaById(id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await ventaService.createVenta(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function anular(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const { motivo } = req.body;
    const result = await ventaService.anularVenta(id, motivo);
    res.json({ success: true, data: result, message: 'Venta anulada correctamente' });
  } catch (error) {
    next(error);
  }
}
