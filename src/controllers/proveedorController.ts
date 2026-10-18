import { Request, Response, NextFunction } from 'express';
import * as proveedorService from '../services/proveedorService';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await proveedorService.getAllProveedores(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await proveedorService.getProveedorById(id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await proveedorService.createProveedor(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await proveedorService.updateProveedor(id, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    await proveedorService.deleteProveedor(id);
    res.json({ success: true, message: 'Proveedor inactivado correctamente' });
  } catch (error) {
    next(error);
  }
}
