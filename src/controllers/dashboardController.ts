import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboardService';

export async function getMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await dashboardService.getDashboardMetrics();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getPerformanceIndicators(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await dashboardService.getPerformanceIndicators();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
