import { Request, Response, NextFunction } from 'express';
import * as compraService from '../services/compraService';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await compraService.getAllCompras(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await compraService.getCompraById(id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await compraService.createCompra(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function anular(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await compraService.anularCompra(id);
    res.json({ success: true, data: result, message: 'Compra anulada correctamente' });
  } catch (error) {
    next(error);
  }
}
