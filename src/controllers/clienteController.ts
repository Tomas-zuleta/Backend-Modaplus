import { Request, Response, NextFunction } from 'express';
import * as clienteService from '../services/clienteService';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await clienteService.getAllClientes(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await clienteService.getClienteById(id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await clienteService.createCliente(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await clienteService.updateCliente(id, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    await clienteService.deleteCliente(id);
    res.json({ success: true, message: 'Cliente inactivado correctamente' });
  } catch (error) {
    next(error);
  }
}
