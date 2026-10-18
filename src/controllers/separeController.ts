import { Request, Response, NextFunction } from 'express';
import * as separeService from '../services/separeService';

export async function getAllPlanes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await separeService.getAllPlanesSepare(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getPlanById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await separeService.getPlanSepareById(id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await separeService.createPlanSepare(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function updatePlanEstado(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const { estado } = req.body;
    const result = await separeService.updatePlanSepareEstado(id, estado);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function createAbono(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await separeService.createAbono(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getAbonosByPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const planId = parseInt(req.params.id);
    const result = await separeService.getAbonosByPlan(planId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
